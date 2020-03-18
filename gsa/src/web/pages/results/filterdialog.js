/* Copyright (C) 2016-2019 Greenbone Networks GmbH
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

import {_l} from 'gmp/locale/lang';

import Layout from 'web/components/layout/layout';

import compose from 'web/utils/compose';
import withCapabilities from 'web/utils/withCapabilities';

/* eslint-disable max-len */

import ApplyOverridesGroup from 'web/components/powerfilter/applyoverridesgroup';
import CreateNamedFilterGroup from 'web/components/powerfilter/createnamedfiltergroup';
import FilterStringGroup from 'web/components/powerfilter/filterstringgroup';
import FirstResultGroup from 'web/components/powerfilter/firstresultgroup';
import MinQodGroup from 'web/components/powerfilter/minqodgroup';
import ResultsPerPageGroup from 'web/components/powerfilter/resultsperpagegroup';
import SortByGroup from 'web/components/powerfilter/sortbygroup';
import SeverityLevelsGroup from 'web/components/powerfilter/severitylevelsgroup';
import SolutionTypeGroup from 'web/components/powerfilter/solutiontypegroup';
import withFilterDialog from 'web/components/powerfilter/withFilterDialog';
import FilterDialogPropTypes from 'web/components/powerfilter/dialogproptypes';
import AutoFpGroup from 'web/components/powerfilter/autofpgroup';

/* eslint-enable */

const SORT_FIELDS = [
  {
    name: 'name',
    displayName: _l('脆弱性'),
  },
  {
    name: 'solution_type',
    displayName: _l('解决方案类型'),
  },
  {
    name: 'severity',
    displayName: _l('严重程度'),
  },
  {
    name: 'qod',
    displayName: _l('检测质量'),
  },
  {
    name: 'host',
    displayName: _l('主机（IP）'),
  },
  {
    name: 'hostname',
    displayName: _l('主机（名称）'),
  },
  {
    name: 'location',
    displayName: _l('本地'),
  },
  {
    name: 'created',
    displayName: _l('已创建'),
  },
];

const ResultsFilterDialogComponent = ({
  capabilities,
  filter,
  filterName,
  filterNameValid,
  filterstring,
  saveNamedFilter,
  onFilterChange,
  onFilterStringChange,
  onFilterValueChange,
  onSortByChange,
  onSortOrderChange,
  onValueChange,
}) => (
  <Layout flex="column">
    <FilterStringGroup
      name="filterstring"
      filter={filterstring}
      onChange={onFilterStringChange}
    />

    <ApplyOverridesGroup filter={filter} onChange={onFilterValueChange} />

    <AutoFpGroup filter={filter} onChange={onFilterValueChange} />

    <SeverityLevelsGroup filter={filter} onChange={onFilterValueChange} />

    <SolutionTypeGroup filter={filter} onChange={onFilterChange} />

    <MinQodGroup
      name="min_qod"
      filter={filter}
      onChange={onFilterValueChange}
    />

    <FirstResultGroup filter={filter} onChange={onFilterValueChange} />

    <ResultsPerPageGroup filter={filter} onChange={onFilterValueChange} />

    <SortByGroup
      filter={filter}
      fields={SORT_FIELDS}
      onSortOrderChange={onSortOrderChange}
      onSortByChange={onSortByChange}
    />

    {capabilities.mayCreate('filter') && (
      <CreateNamedFilterGroup
        filter={filter}
        filterName={filterName}
        saveNamedFilter={saveNamedFilter}
        onValueChange={onValueChange}
      />
    )}
  </Layout>
);

ResultsFilterDialogComponent.propTypes = FilterDialogPropTypes;

export default compose(
  withCapabilities,
  withFilterDialog(),
)(ResultsFilterDialogComponent);

// vim: set ts=2 sw=2 tw=80:
