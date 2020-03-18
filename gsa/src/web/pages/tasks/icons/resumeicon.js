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

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import ResumeIcon from 'web/components/icon/resumeicon';

const TaskResumeIcon = ({capabilities, task, onClick}) => {
  if (task.isContainer()) {
    return (
      <ResumeIcon
        active={false}
        alt={_('摘要')}
        title={_('任务是一个容器')}
      />
    );
  }

  if (isDefined(task.schedule)) {
    return (
      <ResumeIcon
        active={false}
        alt={_('摘要')}
        title={_('任务已安排')}
      />
    );
  }

  if (task.isStopped() || task.isInterrupted()) {
    if (capabilities.mayOp('resume_task')) {
      return <ResumeIcon title={_('摘要')} value={task} onClick={onClick} />;
    }
    return (
      <ResumeIcon
        active={false}
        alt={_('摘要')}
        title={_('继续执行任务的权限被拒绝')}
      />
    );
  }

  return (
    <ResumeIcon
      active={false}
      alt={_('摘要')}
      title={_('任务未停止')}
    />
  );
};

TaskResumeIcon.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  task: PropTypes.model.isRequired,
  onClick: PropTypes.func,
};

export default withCapabilities(TaskResumeIcon);

// vim: set ts=2 sw=2 tw=80:
