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

import ManualIcon from 'web/components/icon/manualicon';
import ListIcon from 'web/components/icon/listicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import EntityPage from 'web/entity/page';
import {goto_details, goto_list} from 'web/entity/component';
import EntityPermissions from 'web/entity/permissions';
import EntitiesTab from 'web/entity/tab';
import EntityTags from 'web/entity/tags';
import withEntityContainer, {
  permissionsResourceFilter,
} from 'web/entity/withEntityContainer';

import AlertIcon from 'web/components/icon/alerticon';
import ExportIcon from 'web/components/icon/exporticon';
import CloneIcon from 'web/entity/icon/cloneicon';
import CreateIcon from 'web/entity/icon/createicon';
import EditIcon from 'web/entity/icon/editicon';
import TrashIcon from 'web/entity/icon/trashicon';

import {selector, loadEntity} from 'web/store/entities/alerts';

import {
  selector as permissionsSelector,
  loadEntities as loadPermissions,
} from 'web/store/entities/permissions';

import PropTypes from 'web/utils/proptypes';

import AlertComponent from './component';
import AlertDetails from './details';

const ToolBarIcons = ({
  entity,
  onAlertCloneClick,
  onAlertCreateClick,
  onAlertDeleteClick,
  onAlertDownloadClick,
  onAlertEditClick,
}) => (
  <Divider margin="10px">
    <IconDivider>
      <ManualIcon
        page="vulnerabilitymanagement"
        anchor="alerts"
        title={_('帮助：警报')}
      />
      <ListIcon title={_('警报列表')} page="alerts" />
    </IconDivider>
    <IconDivider>
      <CreateIcon entity={entity} onClick={onAlertCreateClick} />
      <CloneIcon entity={entity} onClick={onAlertCloneClick} />
      <EditIcon entity={entity} onClick={onAlertEditClick} />
      <TrashIcon entity={entity} onClick={onAlertDeleteClick} />
      <ExportIcon
        value={entity}
        title={_('以XML格式导出警报')}
        onClick={onAlertDownloadClick}
      />
    </IconDivider>
  </Divider>
);

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onAlertCloneClick: PropTypes.func.isRequired,
  onAlertCreateClick: PropTypes.func.isRequired,
  onAlertDeleteClick: PropTypes.func.isRequired,
  onAlertDownloadClick: PropTypes.func.isRequired,
  onAlertEditClick: PropTypes.func.isRequired,
};

const Page = ({
  entity,
  permissions = [],
  onChanged,
  onDownloaded,
  onError,
  onInteraction,
  ...props
}) => (
  <AlertComponent
    onCloned={goto_details('alert', props)}
    onCloneError={onError}
    onCreated={goto_details('alert', props)}
    onDeleted={goto_list('alerts', props)}
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
        sectionIcon={<AlertIcon size="large" />}
        title={_('警报')}
        toolBarIcons={ToolBarIcons}
        onAlertCloneClick={clone}
        onAlertCreateClick={create}
        onAlertDeleteClick={delete_func}
        onAlertDownloadClick={download}
        onAlertEditClick={edit}
        onAlertSaveClick={save}
        onInteraction={onInteraction}
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
                    <AlertDetails entity={entity} />
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
  </AlertComponent>
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
  const loadEntityFunc = loadEntity(gmp);
  const loadPermissionsFunc = loadPermissions(gmp);
  return id => dispatch =>
    Promise.all([
      dispatch(loadEntityFunc(id)),
      dispatch(loadPermissionsFunc(permissionsResourceFilter(id))),
    ]);
};

const mapStateToProps = (rootState, {id}) => {
  const permissionsSel = permissionsSelector(rootState);
  return {
    permissions: permissionsSel.getEntities(permissionsResourceFilter(id)),
  };
};

export default withEntityContainer('alert', {
  entitySelector: selector,
  load,
  mapStateToProps,
})(Page);

// vim: set ts=2 sw=2 tw=80:
