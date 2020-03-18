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

import {CERTBUND_FILTER_FILTER} from 'gmp/models/filter';

import Theme from 'web/utils/theme';

import DataTableDisplay from 'web/components/dashboard/display/datatabledisplay'; // eslint-disable-line max-len
import transformCreated from 'web/components/dashboard/display/created/createdtransform'; // eslint-disable-line max-len
import CreatedDisplay from 'web/components/dashboard/display/created/createddisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {CertBundCreatedLoader} from './loaders';

export const CertBundCreatedDisplay = createDisplay({
  loaderComponent: CertBundCreatedLoader,
  displayComponent: CreatedDisplay,
  title: () => _('按创建时间列出CERT-Bund公告'),
  yAxisLabel: _l('# 创建的CERT-Bund公告'),
  y2AxisLabel: _l('全部的CERT-Bund公告'),
  xAxisLabel: _l('时间'),
  yLine: {
    color: Theme.darkGreenTransparent,
    label: _l('创建CERT-Bund公告'),
  },
  y2Line: {
    color: Theme.darkGreenTransparent,
    dashArray: '3, 2',
    label: _l('全部的CERT-Bund公告'),
  },
  displayId: 'cert_bund_adv-by-created',
  displayName: 'CertBundCreatedDisplay',
  filtersFilter: CERTBUND_FILTER_FILTER,
});

export const CertBundCreatedTableDisplay = createDisplay({
  loaderComponent: CertBundCreatedLoader,
  displayComponent: DataTableDisplay,
  title: () => _('按创建时间列出CERT-Bund公告'),
  dataTitles: [
    _l('创建时间'),
    _l('# of CERT-Bund Advs'),
    _l('全部的CERT-Bund公告'),
  ],
  dataRow: row => [row.label, row.y, row.y2],
  dataTransform: transformCreated,
  displayId: 'cert_bund_adv-by-created-table',
  displayName: 'CertBundCreatedTableDisplay',
  filtersFilter: CERTBUND_FILTER_FILTER,
});

registerDisplay(
  CertBundCreatedTableDisplay.displayId,
  CertBundCreatedTableDisplay,
  {
    title: _l('表格：按创建时间列出CERT-Bund公告'),
  },
);

registerDisplay(CertBundCreatedDisplay.displayId, CertBundCreatedDisplay, {
  title: _l('图表：按创建时间列出CERT-Bund公告'),
});

// vim: set ts=2 sw=2 tw=80:
