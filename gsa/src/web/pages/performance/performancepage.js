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

import styled from 'styled-components';

import _ from 'gmp/locale';

import {selectSaveId} from 'gmp/utils/id';
import {isDefined} from 'gmp/utils/identity';

import date from 'gmp/models/date';
import Filter from 'gmp/models/filter';
import {GMP_SCANNER_TYPE} from 'gmp/models/scanner';

import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';
import withClickHandler from 'web/components/form/withClickHandler';

import ManualIcon from 'web/components/icon/manualicon';
import PerformanceIcon from 'web/components/icon/performanceicon';
import WizardIcon from 'web/components/icon/wizardicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import LinkTarget from 'web/components/link/target';

import IconMenu from 'web/components/menu/iconmenu';
import MenuEntry from 'web/components/menu/menuentry';

import Section from 'web/components/section/section';

import {renewSessionTimeout} from 'web/store/usersettings/actions';
import {
  loadEntities as loadScanners,
  selector as scannerSelector,
} from 'web/store/entities/scanners';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';
import {renderSelectItems} from 'web/utils/render';

import StartEndTimeSelection from './startendtimeselection';

const DURATION_HOUR = 60 * 60;
const DURATION_DAY = DURATION_HOUR * 24;
const DURATION_WEEK = DURATION_DAY * 7;
const DURATION_MONTH = DURATION_DAY * 31;
const DURATION_YEAR = DURATION_DAY * 365;

const DURATIONS = {
  hour: DURATION_HOUR,
  day: DURATION_DAY,
  week: DURATION_WEEK,
  month: DURATION_MONTH,
  year: DURATION_YEAR,
};

const ToolBar = ({onDurationChangeClick}) => {
  return (
    <IconDivider>
      <ManualIcon
        page="performance"
        anchor="appliance-performance"
        size="small"
        title={_('帮助：性能')}
      />
      <IconMenu icon={<WizardIcon />} size="small">
        <MenuEntry
          title={_('最后一小时的报告')}
          value="hour"
          onClick={onDurationChangeClick}
        />
        <MenuEntry
          title={_('最后一天的报告')}
          value="day"
          onClick={onDurationChangeClick}
        />
        <MenuEntry
          title={_('上周的报告')}
          value="week"
          onClick={onDurationChangeClick}
        />
        <MenuEntry
          title={_('上个月的报告')}
          value="month"
          onClick={onDurationChangeClick}
        />
        <MenuEntry
          title={_('去年的报告')}
          value="year"
          onClick={onDurationChangeClick}
        />
      </IconMenu>
    </IconDivider>
  );
};

ToolBar.propTypes = {
  onDurationChangeClick: PropTypes.func.isRequired,
};

const ReportImage = withGmp(
  ({
    gmp,
    name,
    duration,
    scannerId,
    endDate,
    endHour,
    endMinute,
    startDate,
    startHour,
    startMinute,
  }) => {
    const params = {
      slave_id: scannerId,
      token: gmp.settings.token,
    };

    if (isDefined(duration)) {
      params.duration = DURATIONS[duration];
    } else {
      params.start_year = startDate.year();
      params.start_month = startDate.month() + 1; // month is zero indexed
      params.start_day = startDate.date();
      params.start_hour = startHour;
      params.start_minute = startMinute;
      params.end_year = endDate.year();
      params.end_month = endDate.month() + 1;
      params.end_day = endDate.date();
      params.end_hour = endHour;
      params.end_minute = endMinute;
    }
    const url = gmp.buildUrl('system_report/' + name + '/report.', params);
    return <img alt="" src={url} />;
  },
);

ReportImage.propTypes = {
  duration: PropTypes.string,
  endDate: PropTypes.date,
  endHour: PropTypes.number,
  endMinute: PropTypes.number,
  name: PropTypes.string.isRequired,
  scannerId: PropTypes.idOrZero.isRequired,
  startDate: PropTypes.date,
  startHour: PropTypes.number,
  startMinute: PropTypes.number,
};

const Selector = withClickHandler()(styled.span`
  ${props => {
    if (props.value !== props.duration) {
      return {
        color: 'blue',
        textDecoration: 'underline',
        cursor: 'pointer',
      };
    }
    return {};
  }}
`);

const SLAVE_SCANNER_FILTER = Filter.fromString('type=' + GMP_SCANNER_TYPE);

class PerformancePage extends React.Component {
  constructor(...args) {
    super(...args);

    const end = date();
    const start = end.clone().subtract(1, 'day');

    this.state = {
      reports: [],
      duration: 'day',
      scannerId: 0,
      startDate: start,
      startHour: start.hour(),
      startMinute: start.minute(),
      endDate: end,
      endHour: end.hour(),
      endMinute: end.minute(),
      scanners: [],
    };

    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleStartEndChange = this.handleStartEndChange.bind(this);
  }

  componentDidMount() {
    const {start, end, scanner} = this.props.location.query;
    const {gmp} = this.props;

    gmp.performance.get().then(response => {
      this.setState({reports: response.data});
    });

    this.props.loadScanners();

    if (isDefined(start) && isDefined(end)) {
      let startDate = date(start);

      if (!startDate.isValid()) {
        startDate = date();
      }

      let endDate = date(end);
      if (!endDate.isValid()) {
        endDate = date();
      }

      this.setState({
        duration: undefined,
        endDate: endDate,
        endHour: endDate.hour(),
        endMinute: endDate.minute(),
        startDate: startDate,
        startHour: startDate.hour(),
        startMinute: startDate.minute(),
      });
    }

    if (isDefined(scanner)) {
      this.setState({
        scannerId: scanner,
      });
    }
  }

  handleDurationChange(duration) {
    if (isDefined(duration)) {
      const end = date();
      const start = end.clone().subtract(DURATIONS[duration], 'seconds');

      this.setState({
        duration,
        startDate: start,
        startHour: start.hour(),
        startMinute: start.minute(),
        endDate: end,
        endHour: end.hour(),
        endMinute: end.minute(),
      });

      this.handleInteraction();
    }
  }

  handleValueChange(value, name) {
    this.setState({[name]: value});
  }

  handleStartEndChange(data) {
    this.setState({
      ...data,
      duration: undefined,
    });

    this.handleInteraction();
  }

  handleInteraction() {
    const {onInteraction} = this.props;
    if (isDefined(onInteraction)) {
      onInteraction();
    }
  }

  render() {
    const {scanners = []} = this.props;
    const {
      duration,
      reports,
      scannerId,
      startDate,
      startHour,
      startMinute,
      endDate,
      endHour,
      endMinute,
    } = this.state;
    const sensorId = selectSaveId(scanners, scannerId, 0);
    return (
      <Layout flex="column">
        <ToolBar onDurationChangeClick={this.handleDurationChange} />
        <Section
          img={<PerformanceIcon size="large" />}
          title={_('性能')}
        >
          <StartEndTimeSelection
            startDate={startDate}
            startHour={startHour}
            startMinute={startMinute}
            endDate={endDate}
            endMinute={endMinute}
            endHour={endHour}
            onChanged={this.handleStartEndChange}
          />

          <FormGroup title={_('最后一次报告')}>
            <Divider>
              <Selector
                value="hour"
                duration={duration}
                onClick={this.handleDurationChange}
              >
                {_('时')}
              </Selector>
              <Selector
                value="day"
                duration={duration}
                onClick={this.handleDurationChange}
              >
                {_('日')}
              </Selector>
              <Selector
                value="week"
                duration={duration}
                onClick={this.handleDurationChange}
              >
                {_('周')}
              </Selector>
              <Selector
                value="month"
                duration={duration}
                onClick={this.handleDurationChange}
              >
                {_('月')}
              </Selector>
              <Selector
                value="year"
                duration={duration}
                onClick={this.handleDurationChange}
              >
                {_('年')}
              </Selector>
            </Divider>
          </FormGroup>

          <FormGroup title={_('Report for GMP Scanner')}>
            <Select
              name="scannerId"
              value={sensorId}
              items={renderSelectItems(scanners, 0)}
              onChange={this.handleValueChange}
            />
          </FormGroup>

          {reports.map(report => (
            <div key={report.name}>
              <LinkTarget id={report.name} />
              <h2>{report.title}</h2>
              <ReportImage
                name={report.name}
                duration={duration}
                scannerId={sensorId}
                startDate={startDate}
                startHour={startHour}
                startMinute={startMinute}
                endDate={endDate}
                endHour={endHour}
                endMinute={endMinute}
              />
            </div>
          ))}
        </Section>
      </Layout>
    );
  }
}

PerformancePage.propTypes = {
  gmp: PropTypes.gmp.isRequired,
  loadScanners: PropTypes.func.isRequired,
  scanners: PropTypes.arrayOf(PropTypes.model),
  onInteraction: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  onInteraction: () => dispatch(renewSessionTimeout(gmp)()),
  loadScanners: () => dispatch(loadScanners(gmp)(SLAVE_SCANNER_FILTER)),
});

const mapStateToProps = rootState => {
  const select = scannerSelector(rootState);
  return {
    scanners: select.getEntities(SLAVE_SCANNER_FILTER),
  };
};

export default compose(
  withGmp,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PerformancePage);

// vim: set ts=2 sw=2 tw=80:
