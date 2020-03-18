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

import {_, _l} from 'gmp/locale/lang';

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';

import {createEntitiesFooter} from 'web/entities/footer';
import {withEntitiesHeader} from 'web/entities/header';
import {createEntitiesTable} from 'web/entities/table';
import withRowDetails from 'web/entities/withRowDetails';

import SolutionTypeSvgIcon from 'web/components/icon/solutiontypesvgicon';

import Sort from 'web/components/sortby/sortby';

import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';

import NvtDetails from './details';
import NvtRow from './row';

const Header = ({
  actionsColumn,
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
          width="32%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'name' : false}
          onSortChange={onSortChange}
        >
          {_('名称')}
        </TableHead>
        <TableHead
          width="10%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'family' : false}
          onSortChange={onSortChange}
        >
          {_('家族')}
        </TableHead>
        <TableHead
          width="10%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'created' : false}
          onSortChange={onSortChange}
        >
          {_('创建时间')}
        </TableHead>
        <TableHead
          width="10%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'modified' : false}
          onSortChange={onSortChange}
        >
          {_('修改时间')}
        </TableHead>
        <TableHead
          width="18%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'cve' : false}
          onSortChange={onSortChange}
        >
          {_('CVE')}
        </TableHead>
        <TableHead width="1%">
          <Layout align="center">
            {sort ? (
              <Sort by="solution_type" onClick={onSortChange}>
                <SolutionTypeSvgIcon title={_('解决方案类型')} />
              </Sort>
            ) : (
              <SolutionTypeSvgIcon title={_('解决方案类型')} />
            )}
          </Layout>
        </TableHead>
        <TableHead
          width="8%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'severity' : false}
          onSortChange={onSortChange}
        >
          {_('严重程度')}
        </TableHead>
        <TableHead
          width="3%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'qod' : false}
          onSortChange={onSortChange}
        >
          {_('检测质量')}
        </TableHead>
        {actionsColumn}
      </TableRow>
    </TableHeader>
  );
};

Header.propTypes = {
  actionsColumn: PropTypes.element,
  currentSortBy: PropTypes.string,
  currentSortDir: PropTypes.string,
  links: PropTypes.bool,
  sort: PropTypes.bool,
  onSortChange: PropTypes.func,
};

const NvtsHeader = withEntitiesHeader(true)(Header);

const NvtsFooter = createEntitiesFooter({
  span: 10,
  download: 'nvts.xml',
});

export const NvtsTable = createEntitiesTable({
  emptyTitle: _l('当前无可用NVT'),
  row: NvtRow,
  rowDetails: withRowDetails('nvt', 10)(NvtDetails),
  header: NvtsHeader,
  footer: NvtsFooter,
});

export default NvtsTable;

// vim: set ts=2 sw=2 tw=80:
