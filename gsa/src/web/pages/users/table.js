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
import {_l} from 'gmp/locale/lang';

import {createEntitiesFooter} from '../../entities/footer.js';
import {createEntitiesTable} from '../../entities/table.js';
import withRowDetails from '../../entities/withRowDetails.js';

import UserDetails from './details.js';
import Header from './header.js';
import Row from './row.js';

export const SORT_FIELDS = [
  {
    name: 'name',
    displayName: _l('名称'),
  },
  {
    name: 'roles',
    displayName: _l('角色'),
  },
  {
    name: 'groups',
    displayName: _l('组'),
  },
  {
    name: 'host_access',
    displayName: _l('主机访问'),
  },
  {
    name: 'ldap',
    displayName: _l('认证类型'),
  },
];

const UsersTable = createEntitiesTable({
  emptyTitle: _l('当前无可用用户'),
  header: Header,
  row: Row,
  rowDetails: withRowDetails('user')(UserDetails),
  footer: createEntitiesFooter({
    download: 'users.xml',
    span: 7,
    delete: true,
  }),
});

export default UsersTable;

// vim: set ts=2 sw=2 tw=80:
