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

import _ from 'gmp/locale';
import {longDate} from 'gmp/locale/date';

import {isDefined} from 'gmp/utils/identity';

import ExportIcon from 'web/components/icon/exporticon';
import ListIcon from 'web/components/icon/listicon';
import ManualIcon from 'web/components/icon/manualicon';
import OverrideIcon from 'web/components/icon/overrideicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import EntityPage, {Col} from 'web/entity/page';
import {goto_details, goto_list} from 'web/entity/component';
import EntityPermissions from 'web/entity/permissions';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer, {
  permissionsResourceFilter,
} from 'web/entity/withEntityContainer';

import CloneIcon from 'web/entity/icon/cloneicon';
import CreateIcon from 'web/entity/icon/createicon';
import EditIcon from 'web/entity/icon/editicon';
import TrashIcon from 'web/entity/icon/trashicon';

import {
  selector as overridesSelector,
  loadEntity,
} from 'web/store/entities/overrides';

import {
  selector as permissionsSelector,
  loadEntities as loadPermissions,
} from 'web/store/entities/permissions';

import PropTypes from 'web/utils/proptypes';
import {renderYesNo} from 'web/utils/render';

import OverrideDetails from './details';
import OverrideComponent from './component';

const ToolBarIcons = ({
  entity,
  onOverrideCloneClick,
  onOverrideCreateClick,
  onOverrideDeleteClick,
  onOverrideDownloadClick,
  onOverrideEditClick,
}) => (
  <Divider margin="10px">
    <IconDivider>
      <ManualIcon
        page="vulnerabilitymanagement"
        anchor="overrides-and-false-positives"
        title={_('帮助：复写')}
      />
      <ListIcon title={_('复写列表')} page="overrides" />
    </IconDivider>
    <IconDivider>
      <CreateIcon entity={entity} onClick={onOverrideCreateClick} />
      <CloneIcon entity={entity} onClick={onOverrideCloneClick} />
      <EditIcon entity={entity} onClick={onOverrideEditClick} />
      <TrashIcon entity={entity} onClick={onOverrideDeleteClick} />
      <ExportIcon
        value={entity}
        title={_('以XML格式导出复写')}
        onClick={onOverrideDownloadClick}
      />
    </IconDivider>
  </Divider>
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onOverrideCloneClick: PropTypes.func.isRequired,
  onOverrideCreateClick: PropTypes.func.isRequired,
  onOverrideDeleteClick: PropTypes.func.isRequired,
  onOverrideDownloadClick: PropTypes.func.isRequired,
  onOverrideEditClick: PropTypes.func.isRequired,
};

const Details = ({entity, ...props}) => {
  const {nvt} = entity;
  return (
    <Layout flex="column">
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          <TableRow>
            <TableData>{_('NVT名称')}</TableData>
            <TableData>
              {isDefined(nvt) ? (
                <DetailsLink id={nvt.id} type="nvt">
                  {nvt.name}
                </DetailsLink>
              ) : (
                _('没有。 结果是一个开放的端口。')
              )}
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('NVT OID')}</TableData>
            <TableData>{nvt.id}</TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('激活')}</TableData>
            <TableData>
              {renderYesNo(entity.isActive())}
              {entity.isActive() &&
                isDefined(entity.endTime) &&
                ' ' +
                  _('直到 {{- enddate}}', {enddate: longDate(entity.endTime)})}
            </TableData>
          </TableRow>
        </TableBody>
      </InfoTable>

      <OverrideDetails entity={entity} {...props} />
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
};

const Page = ({
  entity,
  permissions = [],
  onError,
  onChanged,
  onDownloaded,
  onInteraction,
  ...props
}) => (
  <OverrideComponent
    onCloned={goto_details('override', props)}
    onCloneError={onError}
    onCreated={goto_details('override', props)}
    onDeleted={goto_list('overrides', props)}
    onDeleteError={onError}
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInteraction={onInteraction}
    onSaved={onChanged}
  >
    {({clone, create, delete: delete_func, download, edit, save}) => (
      <EntityPage
        {...props}
        entity={entity}
        sectionIcon={<OverrideIcon size="large" />}
        title={_('复写')}
        toolBarIcons={ToolBarIcons}
        onChanged={onChanged}
        onDownloaded={onDownloaded}
        onError={onError}
        onInteraction={onInteraction}
        onOverrideCloneClick={clone}
        onOverrideCreateClick={create}
        onOverrideDeleteClick={delete_func}
        onOverrideDownloadClick={download}
        onOverrideEditClick={edit}
        onOverrideSaveClick={save}
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
                  <EntitiesTab entities={permissions}>
                    {_('权限')}
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
                  <TabPanel>
                    <EntityPermissions
                      entity={entity}
                      permissions={permissions}
                      onChanged={onChanged}
                      onDownloaded={onDownloaded}
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
  </OverrideComponent>
);

Page.propTypes = {
  entity: PropTypes.model,
  permissions: PropTypes.array,
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const load = gmp => {
  const loadOverride = loadEntity(gmp);
  const loadPermissionsFunc = loadPermissions(gmp);
  return id => dispatch =>
    Promise.all([
      dispatch(loadOverride(id)),
      dispatch(loadPermissionsFunc(permissionsResourceFilter(id))),
    ]);
};

const mapStateToProps = (rootState, {id}) => {
  const permissionsSel = permissionsSelector(rootState);
  return {
    permissions: permissionsSel.getEntities(permissionsResourceFilter(id)),
  };
};

export default withEntityContainer('override', {
  entitySelector: overridesSelector,
  load,
  mapStateToProps,
})(Page);

// vim: set ts=2 sw=2 tw=80:
