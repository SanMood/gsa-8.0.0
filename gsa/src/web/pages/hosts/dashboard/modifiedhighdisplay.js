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
import React from 'react';

import {_, _l} from 'gmp/locale/lang';
import {shortDate} from 'gmp/locale/date';

import {parseInt, parseDate} from 'gmp/parser';

import {isDefined} from 'gmp/utils/identity';

import Filter, {HOSTS_FILTER_FILTER} from 'gmp/models/filter';
import FilterTerm from 'gmp/models/filter/filterterm';

import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';

import LineChart, {lineDataPropType} from 'web/components/chart/line';

import DataDisplay from 'web/components/dashboard/display/datadisplay';
import DataTableDisplay from 'web/components/dashboard/display/datatabledisplay'; // eslint-disable-line max-len
import withFilterSelection from 'web/components/dashboard/display/withFilterSelection'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {totalCount} from 'web/components/dashboard/display/utils';
import {registerDisplay} from 'web/components/dashboard/registry';

import {HostsModifiedLoader} from './loaders';

const transformModified = (data = {}) => {
  let {groups = []} = data;
  groups = groups.filter(group => group.subgroup.value === 'High');
  const sum = totalCount(groups);
  const tdata = groups.map(group => {
    const {value, count, c_count} = group;
    const modified = parseDate(value);
    return {
      x: modified,
      label: shortDate(modified),
      y: parseInt(count),
      y2: parseInt(c_count),
    };
  });

  tdata.total = sum;
  return tdata;
};

export class HostsModifiedHighDisplay extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleRangeSelect = this.handleRangeSelect.bind(this);
  }

  handleRangeSelect(start, end) {
    const {filter, onFilterChanged} = this.props;

    if (!isDefined(onFilterChanged)) {
      return;
    }

    let {x: startDate} = start;
    let {x: endDate} = end;
    const dateFormat = 'YYYY-MM-DDTHH:mm';

    let newFilter = isDefined(filter) ? filter.copy() : new Filter();

    if (isDefined(startDate)) {
      if (startDate.isSame(endDate)) {
        startDate = startDate.clone().subtract(1, 'day');
        endDate = endDate.clone().add(1, 'day');
      }

      const startTerm = FilterTerm.fromString(
        `modified>${startDate.format(dateFormat)}`,
      );

      if (!newFilter.hasTerm(startTerm)) {
        newFilter = newFilter.and(Filter.fromTerm(startTerm));
      }
    }

    if (isDefined(endDate)) {
      const endTerm = FilterTerm.fromString(
        `modified<${endDate.format(dateFormat)}`,
      );

      if (!newFilter.hasTerm(endTerm)) {
        newFilter = newFilter.and(Filter.fromTerm(endTerm));
      }
    }

    onFilterChanged(newFilter);
  }

  render() {
    const {filter, ...props} = this.props;
    return (
      <HostsModifiedLoader filter={filter}>
        {loaderProps => (
          <DataDisplay
            {...props}
            {...loaderProps}
            dataTransform={transformModified}
            filter={filter}
            title={({data: tdata}) =>
              _('按修改时间列出主机（高危）（总计：{{count}}）', {
                count: tdata.total,
              })
            }
          >
            {({width, height, data: tdata, svgRef, state}) => (
              <LineChart
                timeline
                svgRef={svgRef}
                width={width}
                height={height}
                data={tdata}
                yAxisLabel={_('# of Modified Hosts (High)')}
                y2AxisLabel={_('所有主机（高危）')}
                xAxisLabel={_('时间')}
                yLine={{
                  color: Theme.darkGreenTransparent,
                  label: _('已修改的主机（高危）'),
                }}
                y2Line={{
                  color: Theme.darkGreenTransparent,
                  dashArray: '3, 2',
                  label: _('所有主机（高危）'),
                }}
                showLegend={state.showLegend}
                onRangeSelected={this.handleRangeSelect}
              />
            )}
          </DataDisplay>
        )}
      </HostsModifiedLoader>
    );
  }
}

HostsModifiedHighDisplay.propTypes = {
  filter: PropTypes.filter,
  xAxisLabel: PropTypes.string,
  y2AxisLabel: PropTypes.string,
  y2Line: lineDataPropType,
  yAxisLabel: PropTypes.string,
  yLine: lineDataPropType,
  onFilterChanged: PropTypes.func,
};

HostsModifiedHighDisplay = withFilterSelection({
  filtersFilter: HOSTS_FILTER_FILTER,
})(HostsModifiedHighDisplay);

HostsModifiedHighDisplay.displayId = 'host-by-high-modification-time';

export const HostsModifiedHighTableDisplay = createDisplay({
  loaderComponent: HostsModifiedLoader,
  displayComponent: DataTableDisplay,
  dataTransform: transformModified,
  title: ({data: tdata}) =>
    _('按修改时间列出主机（高危）（总计：{{count}}）', {
      count: tdata.total,
    }),
  dataTitles: [
    _l('创建时间'),
    _l('# of Modified Hosts (High)'),
    _l('所有主机（高危）'),
  ],
  dataRow: row => [row.label, row.y, row.y2],
  filtersFilter: HOSTS_FILTER_FILTER,
  displayId: 'host-by-high-modification-time-table',
  displayName: 'HostsModifiedHighTableDisplay',
});

registerDisplay(HostsModifiedHighDisplay.displayId, HostsModifiedHighDisplay, {
  title: _l('图表：按修改时间列出主机（高危）（总计：{{count}}）'),
});

registerDisplay(
  HostsModifiedHighTableDisplay.displayId,
  HostsModifiedHighTableDisplay,
  {
    title: _l('表格：按修改时间列出主机（高危）（总计：{{count}}）'),
  },
);

// vim: set ts=2 sw=2 tw=80:
