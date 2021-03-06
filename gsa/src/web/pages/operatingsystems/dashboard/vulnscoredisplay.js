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

import {withRouter} from 'react-router-dom';

import styled from 'styled-components';

import {_, _l} from 'gmp/locale/lang';
import {longDate} from 'gmp/locale/date';

import {parseFloat, parseSeverity} from 'gmp/parser';

import {OS_FILTER_FILTER} from 'gmp/models/filter';

import {resultSeverityRiskFactor} from 'web/utils/severity';
import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';

import BarChart from 'web/components/chart/bar';

import DataDisplay from 'web/components/dashboard/display/datadisplay';
import DataTableDisplay from 'web/components/dashboard/display/datatabledisplay'; // eslint-disable-line max-len
import withFilterSelection from 'web/components/dashboard/display/withFilterSelection'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';
import {riskFactorColorScale} from 'web/components/dashboard/display/utils';

import {OsVulnScoreLoader} from './loaders';

const ToolTip = styled.div`
  font-weight: normal;
  text-align: center;
  line-height: 1.2em;
`;

const transformVulnScoreData = (data = {}, {severityClass}) => {
  const {groups = []} = data;
  const tdata = groups
    .filter(group => {
      const {stats = {}} = group;
      const {average_severity_score = 0} = stats;
      return parseFloat(average_severity_score.max) > 0;
    })
    .map(group => {
      const {stats, text, value: id} = group;
      const {hosts, modified, name} = text;
      const {average_severity, average_severity_score} = stats;
      const averageSeverity = parseSeverity(average_severity.mean);
      const riskFactor = resultSeverityRiskFactor(averageSeverity);
      const modifiedDate = longDate(modified);
      const toolTip = (
        <ToolTip>
          <b>{name}:</b>
          <br />
          {average_severity_score.max}
          <br />
          {_('{{hosts}}个平均严重程度为{{avgSev}}的主机', {
            hosts: parseFloat(hosts),
            avgSev: parseFloat(averageSeverity),
          })}
          <br />
          <b>{_('更新时间：')}</b>
          {modifiedDate}
        </ToolTip>
      );

      return {
        y: parseFloat(average_severity_score.max),
        x: name,
        label: name,
        color: riskFactorColorScale(riskFactor),
        toolTip,
        id,
      };
    });
  return tdata.reverse();
};

export class OsVulnScoreDisplay extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleDataClick = this.handleDataClick.bind(this);
  }

  handleDataClick(data) {
    const {history} = this.props;

    history.push(`/operatingsystem/${data.id}`);
  }

  render() {
    const {filter, ...props} = this.props;
    return (
      <OsVulnScoreLoader filter={filter}>
        {loaderProps => (
          <DataDisplay
            {...props}
            {...loaderProps}
            filter={filter}
            dataTransform={transformVulnScoreData}
            title={() => _('最易受攻击的操作系统')}
            showToggleLegend={false}
          >
            {({width, height, data: tdata, svgRef}) => (
              <BarChart
                svgRef={svgRef}
                horizontal
                showLegend={false}
                width={width}
                height={height}
                data={tdata}
                xLabel={_('漏洞（严重性）分数')}
                onDataClick={this.handleDataClick}
              />
            )}
          </DataDisplay>
        )}
      </OsVulnScoreLoader>
    );
  }
}

OsVulnScoreDisplay.propTypes = {
  filter: PropTypes.filter,
  history: PropTypes.object.isRequired,
};

OsVulnScoreDisplay.displayId = 'os-by-most-vulnerable';

OsVulnScoreDisplay = compose(
  withRouter,
  withFilterSelection({
    filtersFilter: OS_FILTER_FILTER,
  }),
)(OsVulnScoreDisplay);

export const OsVulnScoreTableDisplay = createDisplay({
  loaderComponent: OsVulnScoreLoader,
  displayComponent: DataTableDisplay,
  dataTitles: [_l('Operating System Name'), _l('最高. 平均严重程度分数')],
  dataRow: row => [row.x, row.y],
  dataTransform: transformVulnScoreData,
  title: ({data: tdata}) => _('Most Vulnerable Operating Systems'),
  displayId: 'os-by-most-vulnerable-table',
  displayName: 'OsVulnScoreTableDisplay',
  filtersFilter: OS_FILTER_FILTER,
});

registerDisplay(OsVulnScoreDisplay.displayId, OsVulnScoreDisplay, {
  title: _l('图表：按漏洞评分列出的操作系统'),
});

registerDisplay(OsVulnScoreTableDisplay.displayId, OsVulnScoreTableDisplay, {
  title: _l('表格：按漏洞评分列出的操作系统'),
});

// vim: set ts=2 sw=2 tw=80:
