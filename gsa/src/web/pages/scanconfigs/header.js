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

import PropTypes from '../../utils/proptypes.js';

import TableHead from '../../components/table/head.js';
import TableHeader from '../../components/table/header.js';
import TableRow from '../../components/table/row.js';

const Header = ({
  actions = true,
  links = true,
  sort = true,
  currentSortBy,
  currentSortDir,
  onSortChange,
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead
          width="72%"
          rowSpan="2"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'name' : false}
          onSortChange={onSortChange}
        >
          {_('名称')}
        </TableHead>
        <TableHead width="10%" colSpan="2">
          {_('系列')}
        </TableHead>
        <TableHead width="10%" colSpan="2">
          {_('NVT')}
        </TableHead>
        {actions && (
          <TableHead rowSpan="2" width="8%" align="center">
            {_('操作')}
          </TableHead>
        )}
      </TableRow>

      <TableRow>
        <TableHead
          width="5%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'families_total' : false}
          onSortChange={onSortChange}
        >
          {_('总计')}
        </TableHead>
        <TableHead
          width="5%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'families_trend' : false}
          onSortChange={onSortChange}
        >
          {_('趋势')}
        </TableHead>

        <TableHead
          width="5%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'nvts_total' : false}
          onSortChange={onSortChange}
        >
          {_('总计')}
        </TableHead>
        <TableHead
          width="5%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'nvts_trend' : false}
          onSortChange={onSortChange}
        >
          {_('趋势')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

Header.propTypes = {
  actions: PropTypes.element,
  currentSortBy: PropTypes.string,
  currentSortDir: PropTypes.string,
  links: PropTypes.bool,
  sort: PropTypes.bool,
  onSortChange: PropTypes.func,
};

export default Header;

// vim: set ts=2 sw=2 tw=80:
