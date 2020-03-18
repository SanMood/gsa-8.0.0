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
import {_, _l} from 'gmp/locale/lang';

import {isDefined} from 'gmp/utils/identity';

import {_localeData} from 'gmp/models/date';
import {ReccurenceFrequency} from 'gmp/models/event';

const WEEKDAY = {
  monday: _l('星期一'),
  tuesday: _l('星期二'),
  wednesday: _l('星期三'),
  thursday: _l('星期四'),
  friday: _l('星期五'),
  saturday: _l('星期六'),
  sunday: _l('星期日'),
};

export const renderRecurrence = ({
  freq,
  interval = 1,
  weekdays,
  monthdays,
} = {}) => {
  switch (freq) {
    case ReccurenceFrequency.YEARLY:
      if (interval === 1) {
        return _('每年');
      }
      return _('每{{interval}}年', {interval});

    case ReccurenceFrequency.MONTHLY:
      if (isDefined(monthdays)) {
        if (interval === 1) {
          return _('每月{{days}}天', {
            days: monthdays.join(', '),
          });
        }
        return _('每{{interval}}个月的{{days}}天', {
          interval,
          days: monthdays.join(', '),
        });
      } else if (isDefined(weekdays)) {
        const weekday = weekdays.getSelectedWeekDay();
        let nth = weekdays.get(weekday);
        const localeData = _localeData();
        if (nth === '-1') {
          nth = _('最后');
          if (interval === 1) {
            return _('每月的最后{{weekday}}', {
              weekday: WEEKDAY[weekday],
            });
          }
          return _('每{{interval}}个月的最后{{weekday}}个月', {
            weekday: WEEKDAY[weekday],
            interval,
          });
        }
        if (interval === 1) {
          return _('每月{{nth}} {{weekday}}', {
            nth: localeData.ordinal(nth),
            weekday: WEEKDAY[weekday],
          });
        }
        return _('每{{interval}}个月{{nth}} {{weekday}}', {
          nth: localeData.ordinal(nth),
          weekday: WEEKDAY[weekday],
          interval,
        });
      } else if (interval === 1) {
        return _('每个月');
      }
      return _('每{{interval}}个月', {interval});

    case ReccurenceFrequency.WEEKLY:
      if (isDefined(weekdays)) {
        const days = weekdays
          .entries()
          .filter(([, value]) => value)
          .map(([day]) => WEEKDAY[day]);

        if (interval === 1) {
          return _('每周{{days}}', {days: days.join(', ')});
        }
        return _('Every {{interval}} weeks on {{days}}', {
          interval,
          days: days.join(', '),
        });
      }
      if (interval === 1) {
        return _('每周');
      }
      return _('每{{interval}}周', {interval});

    case ReccurenceFrequency.DAILY:
      if (interval === 1) {
        return _('每天');
      }
      return _('每{{interval}}天', {interval});

    case ReccurenceFrequency.HOURLY:
      if (interval === 1) {
        return _('小时');
      }
      return _('每{{interval}}小时', {interval});

    case ReccurenceFrequency.MINUTELY:
      if (interval === 1) {
        return _('每分钟');
      }
      return _('每{{interval}}分钟', {interval});

    case ReccurenceFrequency.SECONDLY:
      if (interval === 1) {
        return _('每秒');
      }
      return _('每{{interval}}秒', {interval});

    default:
      return _('仅一次');
  }
};

export const renderDuration = duration => {
  return isDefined(duration) && duration.asSeconds() > 0
    ? duration.humanize()
    : _('整个操作');
};

// vim: set ts=2 sw=2 tw=80:
