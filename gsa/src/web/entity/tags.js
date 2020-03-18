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
import 'core-js/fn/array/from';
import 'core-js/fn/set';

import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';

import {typeName, getEntityType} from 'gmp/utils/entitytype';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import DisableIcon from 'web/components/icon/disableicon';
import EditIcon from 'web/components/icon/editicon';
import ManualIcon from 'web/components/icon/manualicon';
import NewIcon from 'web/components/icon/newicon';
import DeleteIcon from 'web/components/icon/deleteicon';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';
import IconDivider from 'web/components/layout/icondivider';

import DetailsLink from 'web/components/link/detailslink';

import Table from 'web/components/table/stripedtable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHeader from 'web/components/table/header';
import TableHead from 'web/components/table/head';
import TableRow from 'web/components/table/row';

import TagComponent from 'web/pages/tags/component';

const SectionElementDivider = styled(Divider)`
  margin-bottom: 3px;
`;

const SectionElements = withCapabilities(
  ({capabilities, entity, onTagCreateClick}) => (
    <Layout grow align="end">
      <SectionElementDivider margin="10px">
        <IconDivider>
          {capabilities.mayCreate('tag') && (
            <NewIcon
              title={_('新建标签')}
              value={entity}
              onClick={onTagCreateClick}
            />
          )}
          <ManualIcon
            page="gui_introduction"
            anchor="tags"
            title={_('帮助：用户标签')}
          />
        </IconDivider>
      </SectionElementDivider>
    </Layout>
  ),
);

SectionElements.propTypes = {
  entity: PropTypes.model.isRequired,
  onTagCreateClick: PropTypes.func.isRequired,
};

class EntityTagsTable extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleEditTag = this.handleEditTag.bind(this);
  }

  handleCreateTag() {
    const {entity, onTagCreateClick} = this.props;

    const entityType = getEntityType(entity);

    onTagCreateClick({
      fixed: true,
      resource_ids: [entity.id],
      resource_type: entityType,
      name: _('{{type}}:unnamed', {type: entityType}),
    });
  }

  handleEditTag(tag) {
    const {onTagEditClick} = this.props;
    onTagEditClick(tag, {fixed: true});
  }

  render() {
    const {entity, onTagDisableClick, onTagRemoveClick} = this.props;
    const {userTags} = entity;
    const count = userTags.length;
    const entityType = getEntityType(entity);
    return (
      <Layout flex="column" title={_('用户标签 ({{count}})', {count})}>
        <SectionElements
          entity={entity}
          onTagCreateClick={this.handleCreateTag}
        />
        {count === 0 ? (
          _('当前无可用用户标签')
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{_('名称')}</TableHead>
                <TableHead>{_('值')}</TableHead>
                <TableHead>{_('备注')}</TableHead>
                <TableHead width="8%" align="center">
                  {_('操作')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTags.map(tag => {
                return (
                  <TableRow key={tag.id}>
                    <TableData>
                      <DetailsLink id={tag.id} type="tag">
                        {tag.name}
                      </DetailsLink>
                    </TableData>
                    <TableData>{tag.value}</TableData>
                    <TableData>{tag.comment}</TableData>
                    <TableData>
                      <IconDivider align="center" grow>
                        <DisableIcon
                          value={tag}
                          title={_('禁用标签')}
                          onClick={onTagDisableClick}
                        />
                        <DeleteIcon
                          value={tag}
                          title={_('从{{type}}中移除标签', {
                            type: typeName(entityType),
                          })}
                          onClick={() => onTagRemoveClick(tag.id, entity)}
                        />
                        <EditIcon
                          value={tag}
                          title={_('编辑标签')}
                          onClick={this.handleEditTag}
                        />
                      </IconDivider>
                    </TableData>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Layout>
    );
  }
}

EntityTagsTable.propTypes = {
  entity: PropTypes.model.isRequired,
  onTagCreateClick: PropTypes.func.isRequired,
  onTagDisableClick: PropTypes.func.isRequired,
  onTagEditClick: PropTypes.func.isRequired,
  onTagRemoveClick: PropTypes.func.isRequired,
};

const EntityTags = ({entity, onChanged, onError, onInteraction}) => (
  <TagComponent
    onAdded={onChanged}
    onAddError={onError}
    onCreated={onChanged}
    onCreateError={onError}
    onDeleted={onChanged}
    onDeleteError={onError}
    onDisabled={onChanged}
    onDisableError={onError}
    onEnabled={onChanged}
    onEnableError={onError}
    onInteraction={onInteraction}
    onRemoved={onChanged}
    onRemoveError={onError}
    onSaved={onChanged}
    onSaveError={onError}
  >
    {({create, disable, edit, remove}) => (
      <EntityTagsTable
        entity={entity}
        onTagCreateClick={create}
        onTagDisableClick={disable}
        onTagEditClick={edit}
        onTagRemoveClick={remove}
      />
    )}
  </TagComponent>
);

EntityTags.propTypes = {
  entity: PropTypes.model,
  onChanged: PropTypes.func,
  onError: PropTypes.func,
  onInteraction: PropTypes.func.isRequired,
};

export default EntityTags;

// vim: set ts=2 sw=2 tw=80:
