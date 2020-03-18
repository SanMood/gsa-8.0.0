/* Copyright (C) 2018-2019 Greenbone Networks GmbH
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
import {_, _l} from 'gmp/locale/lang';

import {NVTS_FILTER_FILTER} from 'gmp/models/filter';

import CvssDisplay from 'web/components/dashboard/display/cvss/cvssdisplay';
import CvssTableDisplay from 'web/components/dashboard/display/cvss/cvsstabledisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {NvtsSeverityLoader} from './loaders';

export const NvtsCvssDisplay = createDisplay({
  loaderComponent: NvtsSeverityLoader,
  displayComponent: CvssDisplay,
  yLabel: _l('# of NVTs'),
  title: ({data: tdata}) =>
    _('按CVSS列出NVT（总计：{{count}}）', {count: tdata.total}),
  filtersFilter: NVTS_FILTER_FILTER,
  displayId: 'nvt-by-cvss',
  displayName: 'NvtsCvssDisplay',
});

export const NvtsCvssTableDisplay = createDisplay({
  loaderComponent: NvtsSeverityLoader,
  displayComponent: CvssTableDisplay,
  dataTitles: [_l('严重程度'), _l('# of NVTs')],
  title: ({data: tdata}) =>
    _('按CVSS列出NVT（总计：{{count}}）', {count: tdata.total}),
  filtersFilter: NVTS_FILTER_FILTER,
  displayId: 'nvt-by-cvss-table',
  displayName: 'NvtsCvssTableDisplay',
});

registerDisplay(NvtsCvssDisplay.displayId, NvtsCvssDisplay, {
  title: _l('图表：按CVSS列出NVT'),
});

registerDisplay(NvtsCvssTableDisplay.displayId, NvtsCvssTableDisplay, {
  title: _l('表格：按CVSS列出NVT'),
});

// vim: set ts=2 sw=2 tw=80:
