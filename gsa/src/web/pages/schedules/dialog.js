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

import {_, _l} from 'gmp/locale/lang';

import {isDefined} from 'gmp/utils/identity';

import date, {duration as createDuration} from 'gmp/models/date';
import Event, {ReccurenceFrequency, WeekDays} from 'gmp/models/event';

import PropTypes from 'web/utils/proptypes';

import SaveDialog from 'web/components/dialog/savedialog';

import Select from 'web/components/form/select';
import Spinner from 'web/components/form/spinner';
import FormGroup from 'web/components/form/formgroup';
import TextField from 'web/components/form/textfield';
import DatePicker from 'web/components/form/datepicker';
import TimeZoneSelect from 'web/components/form/timezoneselect';
import CheckBox from 'web/components/form/checkbox';
import Radio from 'web/components/form/radio';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import TimeUnitSelect from './timeunitselect';
import WeekDaySelect, {WeekDaysPropType} from './weekdayselect';
import {renderDuration} from './render';
import DaySelect from './dayselect';
import MonthDaysSelect from './monthdaysselect';

const RECURRENCE_ONCE = 'once';
const RECURRENCE_HOURLY = ReccurenceFrequency.HOURLY;
const RECURRENCE_DAILY = ReccurenceFrequency.DAILY;
const RECURRENCE_WEEKLY = ReccurenceFrequency.WEEKLY;
const RECURRENCE_MONTHLY = ReccurenceFrequency.MONTHLY;
const RECURRENCE_YEARLY = ReccurenceFrequency.YEARLY;
const RECURRENCE_WORKWEEK = 'workweek';
const RECURRENCE_CUSTOM = 'custom';

const RECURRENCE_TYPE_ITEMS = [
  {
    label: _l('仅一次'),
    value: RECURRENCE_ONCE,
  },
  {
    label: _l('每小时'),
    value: RECURRENCE_HOURLY,
  },
  {
    label: _l('每日'),
    value: RECURRENCE_DAILY,
  },
  {
    label: _l('每周'),
    value: RECURRENCE_WEEKLY,
  },
  {
    label: _l('每月'),
    value: RECURRENCE_MONTHLY,
  },
  {
    label: _l('每年'),
    value: RECURRENCE_YEARLY,
  },
  {
    label: _l('工作周（周一至周五）'),
    value: RECURRENCE_WORKWEEK,
  },
  {
    label: _l('自定义...'),
    value: RECURRENCE_CUSTOM,
  },
];

const NTH_DAY_ITEMS = [
  {
    label: _l('第一次'),
    value: '1',
  },
  {
    label: _l('第二次'),
    value: '2',
  },
  {
    label: _l('第三次'),
    value: '3',
  },
  {
    label: _l('第四次'),
    value: '4',
  },
  {
    label: _l('第五次'),
    value: '5',
  },
  {
    label: _l('最后'),
    value: '-1',
  },
];

const RepeatMonthly = {
  nth: 'nth',
  days: 'days',
};

const getNthWeekday = cdate => Math.ceil(cdate.date() / 7);

class ScheduleDialog extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = this.initialState(this.props);

    this.handleSave = this.handleSave.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleStartHoursChange = this.handleStartHoursChange.bind(this);
    this.handleStartMinutesChange = this.handleStartMinutesChange.bind(this);
    this.handleEndHoursChange = this.handleEndHoursChange.bind(this);
    this.handleEndMinutesChange = this.handleEndMinutesChange.bind(this);
    this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
  }

  initialState(props) {
    const {
      duration,
      timezone = 'UTC',
      startDate = date()
        .tz(timezone)
        .startOf('hour')
        .add(1, 'hour'),
    } = props;
    let {freq, interval = 1, weekdays, monthdays} = this.props;

    const monthly =
      freq === ReccurenceFrequency.MONTHLY && !isDefined(weekdays)
        ? RepeatMonthly.days
        : RepeatMonthly.nth;

    let recurrenceType;
    if (isDefined(freq)) {
      if (!isDefined(weekdays) && !isDefined(monthdays) && interval === 1) {
        recurrenceType = freq;
      } else {
        recurrenceType = RECURRENCE_CUSTOM;
      }
    } else {
      recurrenceType = RECURRENCE_ONCE;
      freq = ReccurenceFrequency.WEEKLY;
    }

    const endDate = isDefined(duration)
      ? startDate.clone().add(duration)
      : startDate.clone().add(1, 'hour');

    if (!isDefined(weekdays)) {
      weekdays = new WeekDays();
      weekdays = weekdays.setWeekDayFromDate(startDate);
    }

    const monthlyDay = weekdays.getSelectedWeekDay();
    let monthlyNth = weekdays.get(monthlyDay);
    if (monthlyNth === true) {
      monthlyNth = '' + getNthWeekday(startDate);
    }

    return {
      endDate,
      endOpen: !isDefined(duration),
      freq,
      interval,
      monthdays: isDefined(monthdays) ? monthdays : [startDate.date()],
      recurrenceType,
      monthly,
      monthlyDay,
      monthlyNth,
      startDate,
      timezone,
      weekdays,
    };
  }

  handleValueChange(value, name) {
    this.setState({[name]: value});
  }

  handleStartHoursChange(value) {
    this.setState(state => ({
      startDate: state.startDate.hours(value),
    }));
  }

  handleStartMinutesChange(value) {
    this.setState(state => ({
      startDate: state.startDate.minutes(value),
    }));
  }

  handleEndHoursChange(value) {
    this.setState(state => ({
      endDate: state.endDate.hours(value),
    }));
  }

  handleEndMinutesChange(value) {
    this.setState(state => ({
      endDate: state.endDate.minutes(value),
    }));
  }

  handleTimezoneChange(value) {
    this.setState(state => ({
      endDate: state.endDate.tz(value),
      startDate: state.startDate.tz(value),
      timezone: value,
    }));
  }

  handleSave({
    comment,
    endDate,
    endOpen = false,
    freq,
    id,
    interval,
    monthdays,
    monthly,
    monthlyDay,
    monthlyNth,
    name,
    recurrenceType,
    startDate,
    timezone,
    weekdays,
  }) {
    const {onSave} = this.props;

    if (!isDefined(onSave)) {
      return Promise.resolve();
    }

    startDate = date(startDate).seconds(0);

    if (!endOpen) {
      endDate = date(endDate).seconds(0);

      if (endDate.isSameOrBefore(startDate)) {
        return Promise.reject(
          new Error(
            _(
              '结束日期相同或早于开始日期，请调整开始或结束日期。',
            ),
          ),
        );
      }
    }

    if (recurrenceType === RECURRENCE_WORKWEEK) {
      weekdays = new WeekDays({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
      });
      freq = ReccurenceFrequency.WEEKLY;
    } else if (
      recurrenceType === RECURRENCE_CUSTOM &&
      freq === ReccurenceFrequency.MONTHLY &&
      monthly === RepeatMonthly.nth
    ) {
      weekdays = new WeekDays({
        [monthlyDay]: monthlyNth,
      });
    } else if (recurrenceType !== RECURRENCE_CUSTOM) {
      freq = recurrenceType;
    }

    const setWeekdays =
      recurrenceType === RECURRENCE_WORKWEEK ||
      (recurrenceType === RECURRENCE_CUSTOM &&
        freq === ReccurenceFrequency.WEEKLY) ||
      (recurrenceType === RECURRENCE_CUSTOM &&
        freq === ReccurenceFrequency.MONTHLY &&
        monthly === RepeatMonthly.nth);

    const setMonthydays =
      recurrenceType === RECURRENCE_CUSTOM &&
      freq === ReccurenceFrequency.MONTHLY &&
      monthly === RepeatMonthly.days;

    const isPreDefined =
      recurrenceType === RECURRENCE_HOURLY ||
      recurrenceType === RECURRENCE_DAILY ||
      recurrenceType === RECURRENCE_WEEKLY ||
      recurrenceType === RECURRENCE_MONTHLY ||
      recurrenceType === RECURRENCE_YEARLY ||
      recurrenceType === RECURRENCE_WORKWEEK;

    const event = Event.fromData(
      {
        duration: endOpen ? undefined : createDuration(endDate.diff(startDate)),
        description: comment,
        freq: recurrenceType === RECURRENCE_ONCE ? undefined : freq,
        interval: isPreDefined ? 1 : interval,
        monthdays: setMonthydays ? monthdays : undefined,
        weekdays: setWeekdays ? weekdays : undefined,
        summary: name,
        startDate,
      },
      timezone,
    );

    return onSave({
      id,
      name,
      comment,
      icalendar: event.toIcalString(),
      timezone,
    });
  }

  render() {
    const {
      comment = '',
      id,
      name = _('未命名'),
      title = _('新建计划'),
      onClose,
    } = this.props;

    const {
      endDate,
      endOpen,
      freq,
      interval,
      monthdays,
      recurrenceType,
      monthly,
      monthlyDay,
      monthlyNth,
      startDate,
      timezone,
      weekdays,
    } = this.state;

    const defaultValues = {
      comment,
      id,
      name,
    };

    const duration = endOpen
      ? undefined
      : createDuration(endDate.diff(startDate));

    const values = {
      endDate,
      endOpen,
      freq,
      interval,
      monthdays,
      monthly,
      monthlyDay,
      monthlyNth,
      recurrenceType,
      startDate,
      timezone,
      weekdays,
    };

    return (
      <SaveDialog
        title={title}
        defaultValues={defaultValues}
        values={values}
        onClose={onClose}
        onSave={this.handleSave}
      >
        {({values: state, onValueChange}) => (
          <Layout flex="column">
            <FormGroup title={_('名称')}>
              <TextField
                name="name"
                grow="1"
                value={state.name}
                size="30"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('备注')}>
              <TextField
                name="comment"
                value={state.comment}
                grow="1"
                size="30"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('时区')}>
              <TimeZoneSelect
                name="timezone"
                value={timezone}
                onChange={this.handleTimezoneChange}
              />
            </FormGroup>

            <FormGroup title={_('开始')}>
              <DatePicker
                name="startDate"
                value={startDate}
                onChange={this.handleValueChange}
              />
              <Divider>
                <Spinner
                  name="startHour"
                  type="int"
                  min="0"
                  max="23"
                  size="2"
                  value={startDate.hours()}
                  onChange={this.handleStartHoursChange}
                />
                <span>h</span>
                <Spinner
                  name="startMinute"
                  type="int"
                  min="0"
                  max="59"
                  size="2"
                  value={startDate.minutes()}
                  onChange={this.handleStartMinutesChange}
                />
                <span>m</span>
              </Divider>
            </FormGroup>

            <FormGroup title={_('结束')}>
              <DatePicker
                disabled={state.endOpen}
                name="endDate"
                value={state.endDate}
                onChange={this.handleValueChange}
              />
              <Divider>
                <Spinner
                  disabled={state.endOpen}
                  name="endHour"
                  type="int"
                  min="0"
                  max="23"
                  size="2"
                  value={endDate.hour()}
                  onChange={this.handleEndHoursChange}
                />
                <span>h</span>
                <Spinner
                  disabled={state.endOpen}
                  name="endMinute"
                  type="int"
                  min="0"
                  max="59"
                  size="2"
                  value={endDate.minute()}
                  onChange={this.handleEndMinutesChange}
                />
                <span>m</span>
                <CheckBox
                  title={_('开放式')}
                  name="endOpen"
                  checked={state.endOpen}
                  onChange={this.handleValueChange}
                />
              </Divider>
            </FormGroup>

            <FormGroup title={_('持续时间')}>
              <span>{renderDuration(duration)}</span>
            </FormGroup>

            <FormGroup title={_('重现')}>
              <Select
                name="recurrenceType"
                items={RECURRENCE_TYPE_ITEMS}
                value={state.recurrenceType}
                onChange={this.handleValueChange}
              />
            </FormGroup>

            {state.recurrenceType === RECURRENCE_CUSTOM && (
              <React.Fragment>
                <FormGroup title={_('重复')}>
                  <Divider>
                    <span>{_('每')}</span>
                    <Spinner
                      name="interval"
                      type="int"
                      min="1"
                      size="3"
                      value={state.interval}
                      onChange={this.handleValueChange}
                    />
                    <TimeUnitSelect
                      name="freq"
                      value={state.freq}
                      onChange={this.handleValueChange}
                    />
                  </Divider>
                </FormGroup>

                {state.freq === RECURRENCE_WEEKLY && (
                  <FormGroup title={_('在重复')}>
                    <WeekDaySelect
                      name="weekdays"
                      value={weekdays}
                      onChange={this.handleValueChange}
                    />
                  </FormGroup>
                )}

                {state.freq === RECURRENCE_MONTHLY && (
                  <FormGroup title={_('在重复')}>
                    <Divider flex="column">
                      <Divider>
                        <Radio
                          name="monthly"
                          checked={state.monthly === RepeatMonthly.nth}
                          value={RepeatMonthly.nth}
                          onChange={this.handleValueChange}
                        />
                        <Select
                          items={NTH_DAY_ITEMS}
                          disabled={state.monthly !== RepeatMonthly.nth}
                          name="monthlyNth"
                          value={state.monthlyNth}
                          onChange={this.handleValueChange}
                        />
                        <DaySelect
                          name="monthlyDay"
                          disabled={state.monthly !== RepeatMonthly.nth}
                          value={state.monthlyDay}
                          onChange={this.handleValueChange}
                        />
                      </Divider>
                      <Divider>
                        <Radio
                          title={_('每天重复')}
                          name="monthly"
                          checked={state.monthly === RepeatMonthly.days}
                          value={RepeatMonthly.days}
                          onChange={this.handleValueChange}
                        />
                        <MonthDaysSelect
                          name="monthdays"
                          disabled={state.monthly !== RepeatMonthly.days}
                          value={state.monthdays}
                          onChange={this.handleValueChange}
                        />
                      </Divider>
                    </Divider>
                  </FormGroup>
                )}
              </React.Fragment>
            )}
          </Layout>
        )}
      </SaveDialog>
    );
  }
}

ScheduleDialog.propTypes = {
  comment: PropTypes.string,
  date: PropTypes.date,
  duration: PropTypes.duration,
  freq: PropTypes.oneOf([
    ReccurenceFrequency.HOURLY,
    ReccurenceFrequency.DAILY,
    ReccurenceFrequency.WEEKLY,
    ReccurenceFrequency.MONTHLY,
    ReccurenceFrequency.YEARLY,
  ]),
  id: PropTypes.string,
  interval: PropTypes.number,
  monthdays: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string,
  startDate: PropTypes.date,
  timezone: PropTypes.string,
  title: PropTypes.string,
  weekdays: WeekDaysPropType,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ScheduleDialog;

// vim: set ts=2 sw=2 tw=80:
