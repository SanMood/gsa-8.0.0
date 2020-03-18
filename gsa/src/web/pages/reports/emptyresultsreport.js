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
import 'core-js/fn/string/includes';

import React from 'react';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import InfoPanel from 'web/components/panel/infopanel';

import ReportPanel from './reportpanel';
import FilterIcon from 'web/components/icon/filtericon';
import EditIcon from 'web/components/icon/editicon';
import DeleteIcon from 'web/components/icon/deleteicon';

const EmptyResultsReport = ({
  all,
  filter,
  onFilterAddLogLevelClick,
  onFilterEditClick,
  onFilterDecreaseMinQoDClick,
  onFilterRemoveSeverityClick,
  onFilterRemoveClick,
}) => {
  const levels = filter.get('levels', '');
  const severity = filter.getTerm('severity');
  const min_qod = filter.get('min_qod');
  const has_severity_filter = isDefined(severity) && severity.relation === '>';
  return (
    <Layout flex="column" align={['start', 'stretch']} grow>
      <InfoPanel
        heading={_(
          '报告为空，过滤器与{{all}}个结果中的任何一个都不匹配。',
          {all},
        )}
      />

      <Divider align={['start', 'stretch']} wrap>
        {!levels.includes('g') && (
          <ReportPanel
            icon={props => <FilterIcon {...props} />}
            title={_('日志信息当前被排除')}
            onClick={onFilterAddLogLevelClick}
          >
            {_('在过滤器设置中包括日志信息。')}
          </ReportPanel>
        )}

        {has_severity_filter && (
          <ReportPanel
            icon={props => <FilterIcon {...props} />}
            title={_(
              '您正在使用关键字来设置严重程度的最低限制。',
            )}
            onClick={onFilterRemoveSeverityClick}
          >
            {_('从过滤器设置中删除严重程度限制。')}
          </ReportPanel>
        )}

        {isDefined(min_qod) && min_qod > 30 && (
          <ReportPanel
            icon={props => <FilterIcon {...props} />}
            title={_(
              '可能存在低于当前最低检测质量水平的结果。',
            )}
            onClick={onFilterDecreaseMinQoDClick}
          >
            {_(
              '将过滤器中的最小检测质量降低到30%以查看这些结果。',
            )}
          </ReportPanel>
        )}

        <ReportPanel
          icon={props => <EditIcon {...props} />}
          title={_('您的过滤器设置可能过于精细。')}
          onClick={onFilterEditClick}
        >
          {_('调整并更新您的过滤器设置。')}
        </ReportPanel>

        <ReportPanel
          icon={props => <DeleteIcon {...props} />}
          title={_('您最后一次过滤器的更改可能过于严格。')}
          onClick={onFilterRemoveClick}
        >
          {_('删除所有过滤器设置。')}
        </ReportPanel>
      </Divider>
    </Layout>
  );
};

EmptyResultsReport.propTypes = {
  all: PropTypes.number.isRequired,
  filter: PropTypes.filter.isRequired,
  onFilterAddLogLevelClick: PropTypes.func.isRequired,
  onFilterDecreaseMinQoDClick: PropTypes.func.isRequired,
  onFilterEditClick: PropTypes.func.isRequired,
  onFilterRemoveClick: PropTypes.func.isRequired,
  onFilterRemoveSeverityClick: PropTypes.func.isRequired,
};

export default EmptyResultsReport;

// vim: set ts=2 sw=2 tw=80:
