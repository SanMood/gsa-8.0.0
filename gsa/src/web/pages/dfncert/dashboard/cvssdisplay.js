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

import {DFNCERT_FILTER_FILTER} from 'gmp/models/filter';

import CvssDisplay from 'web/components/dashboard/display/cvss/cvssdisplay';
import CvssTableDisplay from 'web/components/dashboard/display/cvss/cvsstabledisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {DfnCertSeverityLoader} from './loaders';

export const DfnCertCvssDisplay = createDisplay({
  loaderComponent: DfnCertSeverityLoader,
  displayComponent: CvssDisplay,
  yLabel: _l('# of DFN-CERT Advs'),
  title: ({data: tdata}) =>
    _('按CVSS列出DFN-CERT公告（总计：{{count}}）', {count: tdata.total}),
  filtersFilter: DFNCERT_FILTER_FILTER,
  displayId: 'dfn_cert_adv-by-cvss',
  displayName: 'DfnCertCvssDisplay',
});

export const DfnCertCvssTableDisplay = createDisplay({
  loaderComponent: DfnCertSeverityLoader,
  displayComponent: CvssTableDisplay,
  dataTitles: [_l('严重程度'), _l('# of DFN-CERT Advisories')],
  title: ({data: tdata}) =>
    _('按CVSS列出DFN-CERT公告（总计：{{count}}）', {count: tdata.total}),
  filtersFilter: DFNCERT_FILTER_FILTER,
  displayId: 'dfn_cert_adv-by-cvss-table',
  displayName: 'DfnCertCvssTableDisplay',
});

registerDisplay(DfnCertCvssDisplay.displayId, DfnCertCvssDisplay, {
  title: _l('图表：按CVSS列出DFN-CERT公告'),
});

registerDisplay(DfnCertCvssTableDisplay.displayId, DfnCertCvssTableDisplay, {
  title: _l('表格：按CVSS列出DFN-CERT公告'),
});

// vim: set ts=2 sw=2 tw=80:
