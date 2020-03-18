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

import {CVES_FILTER_FILTER} from 'gmp/models/filter';

import Theme from 'web/utils/theme';

import DataTableDisplay from 'web/components/dashboard/display/datatabledisplay'; // eslint-disable-line max-len
import transformCreated from 'web/components/dashboard/display/created/createdtransform'; // eslint-disable-line max-len
import CreatedDisplay from 'web/components/dashboard/display/created/createddisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {CvesCreatedLoader} from './loaders';

export const CvesCreatedDisplay = createDisplay({
  loaderComponent: CvesCreatedLoader,
  displayComponent: CreatedDisplay,
  title: () => _('按创建时间列出CVE'),
  yAxisLabel: _l('# of created CVEs'),
  y2AxisLabel: _l('所有的CVE'),
  xAxisLabel: _l('时间'),
  yLine: {
    color: Theme.darkGreenTransparent,
    label: _l('已创建的CVE'),
  },
  y2Line: {
    color: Theme.darkGreenTransparent,
    dashArray: '3, 2',
    label: _l('所有的CVE'),
  },
  displayId: 'cve-by-created',
  displayName: 'CveCreatedDisplay',
  filtersFilter: CVES_FILTER_FILTER,
});

export const CvesCreatedTableDisplay = createDisplay({
  loaderComponent: CvesCreatedLoader,
  displayComponent: DataTableDisplay,
  title: () => _('按创建时间列出CVE'),
  dataTitles: [_l('创建时间'), _l('# of CVEs'), _l('所有的CVE')],
  dataRow: row => [row.label, row.y, row.y2],
  dataTransform: transformCreated,
  displayId: 'cve-by-created-table',
  displayName: 'CveCreatedTableDisplay',
  filtersFilter: CVES_FILTER_FILTER,
});

registerDisplay(CvesCreatedTableDisplay.displayId, CvesCreatedTableDisplay, {
  title: _l('表格：按创建时间列出CVE'),
});

registerDisplay(CvesCreatedDisplay.displayId, CvesCreatedDisplay, {
  title: _l('图表：按创建时间列出CVE'),
});

// vim: set ts=2 sw=2 tw=80:
