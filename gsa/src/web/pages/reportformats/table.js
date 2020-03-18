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
import {createEntitiesHeader} from '../../entities/header.js';
import {createEntitiesTable} from '../../entities/table.js';
import withRowDetails from '../../entities/withRowDetails.js';

import ReportFormatDetails from './details.js';
import Row from './row.js';

export const SORT_FIELDS = [
  {
    name: 'name',
    displayName: _l('名称'),
    width: '35%',
  },
  {
    name: 'extension',
    displayName: _l('扩展'),
    width: '14%',
  },
  {
    name: 'content_type',
    displayName: _l('内容类型'),
    width: '18%',
  },
  {
    name: 'trust',
    displayName: _l('信任（上次验证）'),
    width: '15%',
  },
  {
    name: 'active',
    displayName: _l('有效'),
    width: '10%',
  },
];

const ReportFormatsTable = createEntitiesTable({
  emptyTitle: _l('当前无可用报告格式'),
  header: createEntitiesHeader(SORT_FIELDS),
  row: Row,
  rowDetails: withRowDetails('reportformat', 10)(ReportFormatDetails),
  footer: createEntitiesFooter({
    download: 'reportformats.xml',
    span: 6,
    trash: true,
  }),
});

export default ReportFormatsTable;

// vim: set ts=2 sw=2 tw=80:
