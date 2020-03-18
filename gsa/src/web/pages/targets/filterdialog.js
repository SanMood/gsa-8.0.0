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

import {createFilterDialog} from '../../components/powerfilter/dialog.js';

const SORT_FIELDS = [
  {
    name: 'name',
    displayName: _l('名称'),
  },
  {
    name: 'hosts',
    displayName: _l('主机'),
  },
  {
    name: 'ips',
    displayName: _l('IP'),
  },
  {
    name: 'port_list',
    displayName: _l('端口列表'),
  },
  {
    name: 'ssh_credential',
    displayName: _l('SSH凭据'),
  },
  {
    name: 'smb_credential',
    displayName: _l('SMB凭据'),
  },
  {
    name: 'esxi_credential',
    displayName: _l('ESXi凭据'),
  },
  {
    name: 'snmp_credential',
    displayName: _l('SNMP凭据'),
  },
];

export default createFilterDialog({
  sortFields: SORT_FIELDS,
});

// vim: set ts=2 sw=2 tw=80:
