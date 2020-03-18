/* Copyright (C) 2017-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';
import {longDate} from 'gmp/locale/date';

import {isDefined} from 'gmp/utils/identity';

import ExportIcon from 'web/components/icon/exporticon';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';
import OvalDefIcon from 'web/components/icon/ovaldeficon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';
import ExternalLink from 'web/components/link/externallink';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import Table from 'web/components/table/stripedtable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHeader from 'web/components/table/header';
import TableHead from 'web/components/table/head';
import TableRow from 'web/components/table/row';

import EntityPage from 'web/entity/page';
import EntityComponent from 'web/entity/component';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer from 'web/entity/withEntityContainer';

import {selector, loadEntity} from 'web/store/entities/ovaldefs';

import PropTypes from 'web/utils/proptypes';

import OvaldefDetails from './details';

const ToolBarIcons = ({entity, onOvaldefDownloadClick}) => (
  <Divider margin="10px">
    <IconDivider>
      <ManualIcon
        page="vulnerabilitymanagement"
        anchor="oval"
        title={_('帮助：OVAL定义')}
      />
      <ListIcon title={_('OVAL定义列表')} page="ovaldefs" />
    </IconDivider>
    <ExportIcon
      value={entity}
      title={_('导出OVAL定义')}
      onClick={onOvaldefDownloadClick}
    />
  </Divider>
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onOvaldefDownloadClick: PropTypes.func.isRequired,
};

const Criteria = ({criteria}) => {
  const {
    criterions,
    criterias: subcriterias,
    extend_definitions,
    operator,
    comment,
    negate,
  } = criteria;
  return (
    <li>
      <Divider>
        {isDefined(operator) && <b>{operator}</b>}
        {negate && <b>NOT</b>}
        {isDefined(comment) && <span>({comment})</span>}
      </Divider>
      <ul>
        {criterions.map((criterion, i) => (
          <li key={i}>
            <Divider>
              {criterion.negate && <b>NOT</b>}
              <span>{criterion.comment}</span>
              <i>({criterion.test_ref})</i>
            </Divider>
          </li>
        ))}
        {extend_definitions.map((extend_definition, i) => (
          <li key={i}>
            <Divider>
              {extend_definition.negate && <b>NOT</b>}
              <span>{extend_definition.comment}</span>
              <i>({extend_definition.definition_ref})</i>
            </Divider>
          </li>
        ))}
        {subcriterias.map((subcriteria, i) => (
          <Criteria key={i} criteria={subcriteria} />
        ))}
      </ul>
    </li>
  );
};

Criteria.propTypes = {
  criteria: PropTypes.object.isRequired,
};

const StyledDivider = styled(Divider)`
  margin-bottom: 1em;
`;

const Details = ({entity}) => {
  const {affecteds, criterias, references, repository} = entity;
  return (
    <Layout flex="column">
      <OvaldefDetails entity={entity} />

      <h2>{_('受影响的')}</h2>
      {affecteds.length === 0 ? (
        <p>{_('无')}</p>
      ) : (
        affecteds.map(affected => (
          <div key={affected.family}>
            <h3>{_('家族{{family}}', affected)}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{_('类型')}</TableHead>
                  <TableHead>{_('名称')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affected.products.map(product => (
                  <TableRow key={product}>
                    <TableData>{_('产品')}</TableData>
                    <TableData>{product}</TableData>
                  </TableRow>
                ))}
                {affected.platforms.map(platform => (
                  <TableRow key={platform}>
                    <TableData>{_('平台')}</TableData>
                    <TableData>{platform}</TableData>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))
      )}

      <h2>{_('标准')}</h2>
      {criterias.length === 0 ? (
        <p>{_('无')}</p>
      ) : (
        <ul>
          {criterias.map((criteria, i) => (
            <Criteria key={i} criteria={criteria} />
          ))}
        </ul>
      )}

      <h2>{_('参考文献')}</h2>
      {references.length === 0 ? (
        <p>{_('无')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{_('资源')}</TableHead>
              <TableHead>{_('参考ID')}</TableHead>
              <TableHead>{_('URL')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {references.map(ref => (
              <TableRow key={ref.id}>
                <TableData>{ref.source}</TableData>
                <TableData>
                  <DetailsLink type={ref.type} id={ref.id}>
                    {ref.id}
                  </DetailsLink>
                </TableData>
                <TableData>
                  {isDefined(ref.url) && (
                    <ExternalLink to={ref.url}>{ref.url}</ExternalLink>
                  )}
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <h2>{_('存储库历史记录')}</h2>
      {isDefined(repository) ? (
        <div>
          <StyledDivider>
            <b>{_('状态')}</b>
            <span>{repository.status}</span>
          </StyledDivider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_('状态')}</TableHead>
                <TableHead>{_('日期')}</TableHead>
                <TableHead>{_('贡献者')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repository.changes.map(change => (
                <TableRow key={change.name}>
                  <TableData>
                    <Divider>
                      <span>{change.name}</span>
                      {isDefined(change.description) && (
                        <span>
                          (<i>{change.description}</i>)
                        </span>
                      )}
                    </Divider>
                  </TableData>
                  <TableData>{longDate(change.date)}</TableData>
                  <TableData>
                    <Divider>
                      {change.contributors.map(contributor => (
                        <Divider key={contributor.name}>
                          <span>{contributor.name}</span>
                          {isDefined(contributor.organization) && (
                            <span>
                              (<i>{contributor.organization}</i>)
                            </span>
                          )}
                        </Divider>
                      ))}
                    </Divider>
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>{_('无')}</p>
      )}
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
};

const OvaldefPage = ({
  entity,
  onChanged,
  onDownloaded,
  onError,
  onInteraction,
  ...props
}) => (
  <EntityComponent
    name="ovaldef"
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInteraction={onInteraction}
  >
    {({download}) => (
      <EntityPage
        {...props}
        entity={entity}
        sectionIcon={<OvalDefIcon size="large" />}
        title={_('OVAL定义')}
        toolBarIcons={ToolBarIcons}
        onInteraction={onInteraction}
        onOvaldefDownloadClick={download}
      >
        {({activeTab = 0, onActivateTab}) => {
          return (
            <Layout grow="1" flex="column">
              <TabLayout grow="1" align={['start', 'end']}>
                <TabList
                  active={activeTab}
                  align={['start', 'stretch']}
                  onActivateTab={onActivateTab}
                >
                  <Tab>{_('信息')}</Tab>
                  <EntitiesTab entities={entity.userTags}>
                    {_('用户标签')}
                  </EntitiesTab>
                </TabList>
              </TabLayout>

              <Tabs active={activeTab}>
                <TabPanels>
                  <TabPanel>
                    <Details entity={entity} />
                  </TabPanel>
                  <TabPanel>
                    <EntityTags
                      entity={entity}
                      onChanged={onChanged}
                      onError={onError}
                      onInteraction={onInteraction}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Layout>
          );
        }}
      </EntityPage>
    )}
  </EntityComponent>
);

OvaldefPage.propTypes = {
  entity: PropTypes.model,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

export default withEntityContainer('ovaldef', {
  load: loadEntity,
  entitySelector: selector,
})(OvaldefPage);

// vim: set ts=2 sw=2 tw=80:
