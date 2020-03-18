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
import {na} from 'web/utils/render';

import Trend from './trend';

const ScanConfigActions = withEntitiesActions(
  ({
    entity,
    onScanConfigDeleteClick,
    onScanConfigDownloadClick,
    onScanConfigCloneClick,
    onScanConfigEditClick,
  }) => (
    <IconDivider grow align={['center', 'center']}>
      <TrashIcon
        displayName={_('扫描配置')}
        name="config"
        entity={entity}
        onClick={onScanConfigDeleteClick}
      />
      <EditIcon
        displayName={_('扫描配置')}
        name="config"
        entity={entity}
        onClick={onScanConfigEditClick}
      />
      <CloneIcon
        displayName={_('扫描配置')}
        name="config"
        entity={entity}
        title={_('克隆扫描配置')}
        value={entity}
        onClick={onScanConfigCloneClick}
      />
      <ExportIcon
        value={entity}
        title={_('导出扫描配置')}
        onClick={onScanConfigDownloadClick}
      />
    </IconDivider>
  ),
);

ScanConfigActions.propTypes = {
  entity: PropTypes.model.isRequired,
  onScanConfigCloneClick: PropTypes.func.isRequired,
  onScanConfigDeleteClick: PropTypes.func.isRequired,
  onScanConfigDownloadClick: PropTypes.func.isRequired,
  onScanConfigEditClick: PropTypes.func.isRequired,
};

const ScanConfigRow = ({
  actionsComponent: ActionsComponent = ScanConfigActions,
  entity,
  links = true,
  onToggleDetailsClick,
  ...props
}) => (
  <TableRow>
    <EntityNameTableData
      entity={entity}
      link={links}
      type="scanconfig"
      displayName={_('扫描配置')}
      onToggleDetailsClick={onToggleDetailsClick}
    />
    <TableData>{na(entity.families.count)}</TableData>
    <TableData>
      <Trend
        trend={entity.families.trend}
        titleDynamic={_(
          '家族选择是动态的。将自动添加和考虑新的家族。',
        )}
        titleStatic={_(
          '家族选择是静态的。不会自动添加和考虑新的家族。',
        )}
      />
    </TableData>
    <TableData>{na(entity.nvts.count)}</TableData>
    <TableData>
      <Trend
        trend={entity.nvts.trend}
        titleDynamic={_(
          'NVT选择是动态的。将自动添加和考虑选定家族的新NVT。',
        )}
        titleStatic={_(
          'NVT选择是动态的。不会自动添加和考虑选定家族的新NVT。',
        )}
      />
    </TableData>
    <ActionsComponent {...props} entity={entity} />
  </TableRow>
);

ScanConfigRow.propTypes = {
  actionsComponent: PropTypes.component,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default ScanConfigRow;

// vim: set ts=2 sw=2 tw=80:
