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
import 'core-js/fn/array/some';
import 'core-js/fn/object/values';

import React from 'react';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import {WeekDays} from 'gmp/models/event';

import Divider from 'web/components/layout/divider';

import ToggleButton from 'web/components/form/togglebutton';

import PropTypes from 'web/utils/proptypes';

export const WeekDaysPropType = PropTypes.instanceOf(WeekDays);

class WeekDaySelect extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(val, valname) {
    const {onChange, value, name} = this.props;

    if (!isDefined(onChange)) {
      return;
    }

    const newValue = value.setWeekDay(valname, val);

    if (!newValue.isDefault()) {
      // at least one day must be still selected
      onChange(newValue, name);
    }
  }

  render() {
    const {value} = this.props;
    return (
      <Divider>
        <ToggleButton
          name="monday"
          title={_('星期一')}
          checked={value.monday}
          onToggle={this.handleChange}
        >
          {_('Mo.')}
        </ToggleButton>
        <ToggleButton
          name="tuesday"
          title={_('星期二')}
          checked={value.tuesday}
          onToggle={this.handleChange}
        >
          {_('Tu.')}
        </ToggleButton>
        <ToggleButton
          name="wednesday"
          title={_('星期三')}
          checked={value.wednesday}
          onToggle={this.handleChange}
        >
          {_('We.')}
        </ToggleButton>
        <ToggleButton
          name="thursday"
          title={_('星期四')}
          checked={value.thursday}
          onToggle={this.handleChange}
        >
          {_('Th.')}
        </ToggleButton>
        <ToggleButton
          name="friday"
          title={_('星期五')}
          checked={value.friday}
          onToggle={this.handleChange}
        >
          {_('Fr.')}
        </ToggleButton>
        <ToggleButton
          name="saturday"
          title={_('星期六')}
          checked={value.saturday}
          onToggle={this.handleChange}
        >
          {_('Sa.')}
        </ToggleButton>
        <ToggleButton
          name="sunday"
          title={_('星期日')}
          checked={value.sunday}
          onToggle={this.handleChange}
        >
          {_('Su.')}
        </ToggleButton>
      </Divider>
    );
  }
}

WeekDaySelect.propTypes = {
  name: PropTypes.string,
  value: WeekDaysPropType,
  onChange: PropTypes.func,
};

export default WeekDaySelect;

// vim: set ts=2 sw=2 tw=80:
