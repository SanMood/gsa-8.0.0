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
    name: 'vector',
    displayName: _l('向量'),
  },
  {
    name: 'complexity',
    displayName: _l('复杂性'),
  },
  {
    name: 'authentication',
    displayName: _l('身份验证'),
  },
  {
    name: 'confidentiality_impact',
    displayName: _l('机密性影响'),
  },
  {
    name: 'integrity_impact',
    displayName: _l('完整性影响'),
  },
  {
    name: 'availability_impact',
    displayName: _l('可用性影响'),
  },
  {
    name: 'published',
    displayName: _l('发表时间'),
  },
  {
    name: 'severity',
    displayName: _l('严重程度'),
  },
];

export default createFilterDialog({
  sortFields: SORT_FIELDS,
});

// vim: set ts=2 sw=2 tw=80:
