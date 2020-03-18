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

import PropTypes from 'web/utils/proptypes';

import {createEntitiesFooter} from 'web/entities/footer';
import {withEntitiesHeader} from 'web/entities/header';
import {createEntitiesTable} from 'web/entities/table';
import withRowDetails from 'web/entities/withRowDetails';

import Select from 'web/components/form/select';

import Divider from 'web/components/layout/divider';

import Sort from 'web/components/sortby/sortby';

import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';

import TargetDetails from './details';
import TargetRow from './row';

const Header = ({
  actionsColumn,
  filter,
  links = true,
  sort = true,
  currentSortBy,
  currentSortDir,
  onSortChange,
}) => {
  let selectSort = 'ssh_credential';
  const sortBy = filter ? filter.getSortBy() : undefined;

  if (
    sortBy === 'smb_credential' ||
    sortBy === 'esxi_credential' ||
    sortBy === 'snmp_credential'
  ) {
    selectSort = sortBy;
  }
  return (
    <TableHeader>
      <TableRow>
        <TableHead
          width="30%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'name' : false}
          onSortChange={onSortChange}
        >
          {_('名称')}
        </TableHead>
        <TableHead
          width="20%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'hosts' : false}
          onSortChange={onSortChange}
        >
          {_('主机')}
        </TableHead>
        <TableHead
          width="5%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'ips' : false}
          onSortChange={onSortChange}
        >
          {_('IP')}
        </TableHead>
        <TableHead
          width="15%"
          currentSortDir={currentSortDir}
          currentSortBy={currentSortBy}
          sortBy={sort ? 'port_list' : false}
          onSortChange={onSortChange}
        >
          {_('端口列表')}
        </TableHead>
        <TableHead width="22%">
          <Divider>
            <Sort by={sort ? selectSort : false} onClick={onSortChange}>
              {_('证书')}
            </Sort>
            {sort !== false && (
              <Select
                items={[
                  {
                    value: 'ssh_credential',
                    label: _('SSH'),
                  },
                  {
                    value: 'smb_credential',
                    label: _('SMB'),
                  },
                  {
                    value: 'esxi_credential',
                    label: _('ESXi'),
                  },
                  {
                    value: 'snmp_credential',
                    label: _('SNMP'),
                  },
                ]}
                value={selectSort}
                onChange={onSortChange}
              />
            )}
          </Divider>
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
  filter: PropTypes.filter,
  links: PropTypes.bool,
  sort: PropTypes.bool,
  onSortChange: PropTypes.func,
};

const TargetsHeader = withEntitiesHeader()(Header);

const Footer = createEntitiesFooter({
  span: 6,
  trash: true,
  download: 'targets.xml',
});

export default createEntitiesTable({
  emptyTitle: _l('当前无可用目标'),
  row: TargetRow,
  header: TargetsHeader,
  footer: Footer,
  rowDetails: withRowDetails('target', 10)(TargetDetails),
});

// vim: set ts=2 sw=2 tw=80:
