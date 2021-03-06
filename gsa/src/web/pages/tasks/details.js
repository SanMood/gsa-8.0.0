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
import React from 'react';

import {connect} from 'react-redux';

import _ from 'gmp/locale';
import {dateTimeWithTimeZone} from 'gmp/locale/date';

import {isDefined} from 'gmp/utils/identity';

import {YES_VALUE} from 'gmp/parser';

import {duration} from 'gmp/models/date';
import {OPENVAS_SCAN_CONFIG_TYPE} from 'gmp/models/scanconfig';
import {scannerTypeName} from 'gmp/models/scanner';

import {
  loadEntity as loadSchedule,
  selector as scheduleSelector,
} from 'web/store/entities/schedules';

import {
  loadEntity as loadScanConfig,
  selector as scanConfigSelector,
} from 'web/store/entities/scanconfigs';

import PropTypes from 'web/utils/proptypes';
import compose from 'web/utils/compose';
import withGmp from 'web/utils/withGmp';
import {renderYesNo} from 'web/utils/render';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import DetailsTable from 'web/components/table/detailstable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import DetailsBlock from 'web/entity/block';

const compareAlerts = (alertA, alertB) => {
  const nameA = alertA.name.toLowerCase();
  const nameB = alertB.name.toLowerCase();
  if (nameA > nameB) {
    return 1;
  }
  if (nameA < nameB) {
    return -1;
  }
  return 0;
};

class TaskDetails extends React.Component {
  componentDidMount() {
    const {entity} = this.props;

    if (isDefined(entity.config)) {
      this.props.loadScanConfig(entity.config.id);
    }
    if (isDefined(entity.schedule)) {
      this.props.loadSchedule(entity.schedule.id);
    }
  }

  render() {
    const {links = true, entity, scanConfig, schedule} = this.props;
    const {
      alerts,
      apply_overrides,
      auto_delete,
      auto_delete_data,
      average_duration,
      config,
      hosts_ordering,
      in_assets,
      last_report,
      min_qod,
      preferences,
      scanner,
      schedule_periods,
      target,
    } = entity;
    const {max_checks = {}, iface = {}, max_hosts = {}} = preferences;

    let dur;
    const has_duration =
      isDefined(last_report) && isDefined(last_report.scan_start);
    if (has_duration) {
      if (isDefined(last_report.scan_end)) {
        const diff = last_report.scan_end.diff(last_report.scan_start);
        dur = duration(diff).humanize();
      } else {
        dur = _('还未完成');
      }
    } else {
      dur = _('暂无扫描');
    }

    const has_av_duration = isDefined(average_duration) && average_duration > 0;
    const av_duration = has_av_duration ? average_duration.humanize() : '';

    return (
      <Layout grow="1" flex="column">
        {isDefined(target) && (
          <DetailsBlock title={_('目标')}>
            <DetailsLink textOnly={!links} type="target" id={target.id}>
              {target.name}
            </DetailsLink>
          </DetailsBlock>
        )}

        {isDefined(alerts) && (
          <DetailsBlock title={_('警报')}>
            <Divider>
              {alerts.sort(compareAlerts).map(alert => (
                <DetailsLink
                  key={alert.id}
                  textOnly={!links}
                  type="alert"
                  id={alert.id}
                >
                  {alert.name}
                </DetailsLink>
              ))}
            </Divider>
          </DetailsBlock>
        )}

        {isDefined(scanner) && (
          <DetailsBlock title={_('扫描仪')}>
            <DetailsTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('名称')}</TableData>
                  <TableData>
                    <DetailsLink
                      textOnly={!links}
                      type="scanner"
                      id={scanner.id}
                    >
                      {scanner.name}
                    </DetailsLink>
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableData>{_('类型')}</TableData>
                  <TableData>{scannerTypeName(scanner.scannerType)}</TableData>
                </TableRow>
                {isDefined(config) && (
                  <TableRow>
                    <TableData>{_('扫描配置')}</TableData>
                    <TableData>
                      <DetailsLink
                        textOnly={!links}
                        type="scanconfig"
                        id={config.id}
                      >
                        {config.name}
                      </DetailsLink>
                    </TableData>
                  </TableRow>
                )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE && (
                    <TableRow>
                      <TableData>{_('订购目标主机')}</TableData>
                      <TableData>{hosts_ordering}</TableData>
                    </TableRow>
                  )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE && (
                    <TableRow>
                      <TableData>{_('网络源接口')}</TableData>
                      <TableData>{iface.value}</TableData>
                    </TableRow>
                  )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE &&
                  isDefined(max_checks.name) && (
                    <TableRow>
                      <TableData>
                        {_('每个主机同时指向的最大NVT')}
                      </TableData>
                      <TableData>{max_checks.value}</TableData>
                    </TableRow>
                  )}
                {isDefined(scanConfig) &&
                  scanConfig.scan_config_type === OPENVAS_SCAN_CONFIG_TYPE &&
                  isDefined(max_hosts.name) && (
                    <TableRow>
                      <TableData>
                        {_('最大并发扫描主机')}
                      </TableData>
                      <TableData>{max_hosts.value}</TableData>
                    </TableRow>
                  )}
              </TableBody>
            </DetailsTable>
          </DetailsBlock>
        )}

        <DetailsBlock title={_('资产')}>
          <DetailsTable>
            <TableBody>
              <TableRow>
                <TableData>{_('添加到资产')}</TableData>
                <TableData>{renderYesNo(in_assets)}</TableData>
              </TableRow>

              {in_assets === YES_VALUE && (
                <TableRow>
                  <TableData>{_('应用于复写')}</TableData>
                  <TableData>{renderYesNo(apply_overrides)}</TableData>
                </TableRow>
              )}

              {in_assets === YES_VALUE && (
                <TableRow>
                  <TableData>{_('最小质量检测')}</TableData>
                  <TableData>{min_qod + ' %'}</TableData>
                </TableRow>
              )}
            </TableBody>
          </DetailsTable>
        </DetailsBlock>

        {isDefined(schedule) && (
          <DetailsBlock title={_('计划')}>
            <DetailsTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('名称')}</TableData>
                  <TableData>
                    <DetailsLink
                      textOnly={!links}
                      type="schedule"
                      id={schedule.id}
                    >
                      {schedule.name}
                    </DetailsLink>
                  </TableData>
                </TableRow>
                {isDefined(schedule.event) && (
                  <TableRow>
                    <TableData>{_('下一个')}</TableData>
                    <TableData>
                      {dateTimeWithTimeZone(schedule.event.nextDate)}
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            </DetailsTable>
          </DetailsBlock>
        )}

        <DetailsBlock title={_('扫描')}>
          <DetailsTable>
            <TableBody>
              <TableRow>
                <TableData>{_('上次扫描持续时间')}</TableData>
                <TableData>{dur}</TableData>
              </TableRow>
              {has_av_duration && (
                <TableRow>
                  <TableData>{_('平均扫描持续时间')}</TableData>
                  <TableData>{av_duration}</TableData>
                </TableRow>
              )}
              {schedule_periods > 0 && (
                <TableRow>
                  <TableData>{_('期间')}</TableData>
                  <TableData>
                    {schedule_periods > 1
                      ? _('{{nr}}次以上', {nr: schedule_periods})
                      : _('仅一次')}
                  </TableData>
                </TableRow>
              )}
              <TableRow>
                <TableData>{_('自动删除报告')}</TableData>
                <TableData>
                  {auto_delete === 'keep'
                    ? _(
                        '自动删除最旧的报告，但始终保留最新的' +
                          '{{nr}}个报告',
                        {nr: auto_delete_data},
                      )
                    : _('不自动删除报告')}
                </TableData>
              </TableRow>
            </TableBody>
          </DetailsTable>
        </DetailsBlock>
      </Layout>
    );
  }
}

TaskDetails.propTypes = {
  entity: PropTypes.model.isRequired,
  gmp: PropTypes.gmp.isRequired,
  links: PropTypes.bool,
  loadScanConfig: PropTypes.func.isRequired,
  loadSchedule: PropTypes.func.isRequired,
  scanConfig: PropTypes.model,
  schedule: PropTypes.model,
};

const mapStateToProps = (rootState, {entity = {}}) => {
  const scheduleSel = scheduleSelector(rootState);
  const scanConfigSel = scanConfigSelector(rootState);
  return {
    scanConfig: isDefined(entity.config)
      ? scanConfigSel.getEntity(entity.config.id)
      : undefined,
    schedule: isDefined(entity.schedule)
      ? scheduleSel.getEntity(entity.schedule.id)
      : undefined,
  };
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  loadScanConfig: id => dispatch(loadScanConfig(gmp)(id)),
  loadSchedule: id => dispatch(loadSchedule(gmp)(id)),
});

export default compose(
  withGmp,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TaskDetails);

// vim: set ts=2 sw=2 tw=80:
