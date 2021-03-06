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

import _ from 'gmp/locale';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import StartIcon from 'web/components/icon/starticon';

const TaskStartIcon = ({capabilities, task, onClick}) => {
  if (task.isRunning() || task.isContainer()) {
    return null;
  }

  if (!capabilities.mayOp('start_task')) {
    return (
      <StartIcon active={false} title={_('启动任务的权限被拒绝')} />
    );
  }

  if (!task.isActive()) {
    return <StartIcon title={_('开始')} value={task} onClick={onClick} />;
  }
  return <StartIcon active={false} title={_('任务已经激活')} />;
};

TaskStartIcon.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  task: PropTypes.model.isRequired,
  onClick: PropTypes.func,
};

export default withCapabilities(TaskStartIcon);

// vim: set ts=2 sw=2 tw=80:
