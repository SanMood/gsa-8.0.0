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

import {isDefined} from 'gmp/utils/identity';

import PropTypes from '../../utils/proptypes.js';

import DeleteIcon from '../../components/icon/deleteicon.js';

import Table from '../../components/table/stripedtable.js';
import TableBody from '../../components/table/body.js';
import TableData from '../../components/table/data.js';
import TableHead from '../../components/table/head.js';
import TableHeader from '../../components/table/header.js';
import TableRow from '../../components/table/row.js';

const PortRangesTable = ({actions = true, portRanges, onDeleteClick}) => {
  if (!isDefined(portRanges) || portRanges.length === 0) {
    return _('当前无可用端口范围');
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{_('开始')}</TableHead>
          <TableHead>{_('结束')}</TableHead>
          <TableHead>{_('协议')}</TableHead>
          {actions && <TableHead width="3em">{_('操作')}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {portRanges.map(range => (
          <TableRow key={range.start + range.protocol_type}>
            <TableData>{range.start}</TableData>
            <TableData>{range.end}</TableData>
            <TableData>{range.protocol_type}</TableData>
            {actions && (
              <TableData align={['center', 'center']}>
                <DeleteIcon
                  title={_('删除端口范围')}
                  value={range}
                  onClick={onDeleteClick}
                />
              </TableData>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

PortRangesTable.propTypes = {
  actions: PropTypes.bool,
  portRanges: PropTypes.array,
  onDeleteClick: PropTypes.func,
};

export default PortRangesTable;

// vim: set ts=2 sw=2 tw=80:
