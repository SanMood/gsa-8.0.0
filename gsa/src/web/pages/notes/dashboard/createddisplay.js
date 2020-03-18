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

import {NOTES_FILTER_FILTER} from 'gmp/models/filter';

import Theme from 'web/utils/theme';

import CreatedDisplay from 'web/components/dashboard/display/created/createddisplay'; // eslint-disable-line max-len
import DataTableDisplay from 'web/components/dashboard/display/datatabledisplay'; // eslint-disable-line max-len
import transformCreated from 'web/components/dashboard/display/created/createdtransform'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {NotesCreatedLoader} from './loaders';

export const NotesCreatedDisplay = createDisplay({
  loaderComponent: NotesCreatedLoader,
  displayComponent: CreatedDisplay,
  title: () => _('按创建时间列出注释'),
  yAxisLabel: _l('# of Created Notes'),
  y2AxisLabel: _l('所有注释'),
  xAxisLabel: _l('Time'),
  yLine: {
    color: Theme.darkGreenTransparent,
    label: _l('已创建的注释'),
  },
  y2Line: {
    color: Theme.darkGreenTransparent,
    dashArray: '3, 2',
    label: _l('所有注释'),
  },
  displayName: 'NotesCreatedDisplay',
  displayId: 'note-by-created',
  filtersFilter: NOTES_FILTER_FILTER,
});

export const NotesCreatedTableDisplay = createDisplay({
  loaderComponent: NotesCreatedLoader,
  displayComponent: DataTableDisplay,
  title: () => _('按创建时间列出注释'),
  dataTitles: [_l('创建时间'), _l('# of Notes'), _l('所有注释')],
  dataRow: row => [row.label, row.y, row.y2],
  dataTransform: transformCreated,
  displayName: 'NotesCreatedTableDisplay',
  displayId: 'note-by-created-table',
  filtersFilter: NOTES_FILTER_FILTER,
});

registerDisplay(NotesCreatedDisplay.displayId, NotesCreatedDisplay, {
  title: _l('图表：按创建时间列出注释'),
});

registerDisplay(NotesCreatedTableDisplay.displayId, NotesCreatedTableDisplay, {
  title: _l('表格：按创建时间列出注释'),
});

// vim: set ts=2 sw=2 tw=80:
