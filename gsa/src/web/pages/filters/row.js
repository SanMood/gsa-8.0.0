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

import {typeName} from 'gmp/utils/entitytype';

import IconDivider from 'web/components/layout/icondivider';

import ExportIcon from 'web/components/icon/exporticon';

import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import EntityNameTableData from 'web/entities/entitynametabledata';
import withEntitiesActions from 'web/entities/withEntitiesActions';

import CloneIcon from 'web/entity/icon/cloneicon';
import EditIcon from 'web/entity/icon/editicon';
import TrashIcon from 'web/entity/icon/trashicon';

import PropTypes from 'web/utils/proptypes';

const Actions = withEntitiesActions(
  ({
    entity,
    onFilterDeleteClick,
    onFilterDownloadClick,
    onFilterCloneClick,
    onFilterEditClick,
  }) => (
    <IconDivider grow align={['center', 'center']}>
      <TrashIcon
        displayName={_('过滤器')}
        name="filter"
        entity={entity}
        onClick={onFilterDeleteClick}
      />
      <EditIcon
        displayName={_('过滤器')}
        name="filter"
        entity={entity}
        onClick={onFilterEditClick}
      />
      <CloneIcon
        displayName={_('过滤器')}
        name="filter"
        entity={entity}
        title={_('克隆过滤器')}
        value={entity}
        onClick={onFilterCloneClick}
      />
      <ExportIcon
        value={entity}
        title={_('导出过滤器')}
        onClick={onFilterDownloadClick}
      />
    </IconDivider>
  ),
);

Actions.propTypes = {
  entity: PropTypes.model.isRequired,
  onFilterCloneClick: PropTypes.func.isRequired,
  onFilterDeleteClick: PropTypes.func.isRequired,
  onFilterDownloadClick: PropTypes.func.isRequired,
  onFilterEditClick: PropTypes.func.isRequired,
};

const Row = ({
  actionsComponent: ActionsComponent = Actions,
  entity,
  links = true,
  onToggleDetailsClick,
  ...props
}) => (
  <TableRow>
    <EntityNameTableData
      entity={entity}
      link={links}
      type="filter"
      displayName={_('过滤器')}
      onToggleDetailsClick={onToggleDetailsClick}
    />
    <TableData>{entity.toFilterString()}</TableData>
    <TableData>{typeName(entity.filter_type)}</TableData>
    <ActionsComponent {...props} entity={entity} />
  </TableRow>
);

Row.propTypes = {
  actionsComponent: PropTypes.component,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default Row;

// vim: set ts=2 sw=2 tw=80:
