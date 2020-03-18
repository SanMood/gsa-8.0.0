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
import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import {secInfoTypeName} from 'gmp/models/secinfo';
import {
  EVENT_TYPE_UPDATED_SECINFO,
  EVENT_TYPE_NEW_SECINFO,
  EVENT_TYPE_TASK_RUN_STATUS_CHANGED,
  EVENT_TYPE_TICKET_RECEIVED,
  EVENT_TYPE_ASSIGNED_TICKET_CHANGED,
  EVENT_TYPE_OWNED_TICKET_CHANGED,
} from 'gmp/models/alert';

const Event = ({event}) => {
  if (event.type === EVENT_TYPE_NEW_SECINFO) {
    const type = secInfoTypeName(event.data.secinfo_type.value, _('SecInfo'));
    return _('新的{{secinfo_type}}已到达', {secinfo_type: type});
  }

  if (event.type === EVENT_TYPE_UPDATED_SECINFO) {
    const type = secInfoTypeName(event.data.secinfo_type.value, _('SecInfo'));
    return _('更新的{{secinfo_type}}已到达', {secinfo_type: type});
  }

  if (
    event.type === EVENT_TYPE_TASK_RUN_STATUS_CHANGED &&
    isDefined(event.data.status)
  ) {
    return _('任务运行状态已更改为{{status}}', {
      status: event.data.status.value,
    });
  }
  if (event.type === EVENT_TYPE_TICKET_RECEIVED) {
    return _('票据已收到');
  }
  if (event.type === EVENT_TYPE_ASSIGNED_TICKET_CHANGED) {
    return _('分配的票据已更改');
  }
  if (event.type === EVENT_TYPE_OWNED_TICKET_CHANGED) {
    return _('拥有的票据已更改');
  }
  return event.type;
};

export default Event;

// vim: set ts=2 sw=2 tw=80:
