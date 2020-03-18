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

import {isActive} from 'gmp/models/task';

import TaskIcon from 'web/components/icon/taskicon';
import RefreshIcon from 'web/components/icon/refreshicon';
import TargetIcon from 'web/components/icon/targeticon';

import Divider from 'web/components/layout/divider';

import InfoPanel from 'web/components/panel/infopanel';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import ReportPanel from './reportpanel';

const EmptyReport = ({
  capabilities,
  hasTarget = false,
  progress,
  status,
  onTargetEditClick,
}) => {
  const may_edit_target = capabilities.mayEdit('target');
  const isActiveReport = hasTarget && isActive(status);
  return (
    <Divider flex="column" align={['start', 'stretch']} grow>
      <InfoPanel
        heading={_(
          '报告为空，发生这种情况的原因如下：',
        )}
      />
      <Divider wrap>
        {!isActiveReport && (
          <ReportPanel
            icon={props => <TaskIcon {...props} />}
            title={_('扫描没有收集到任何结果')}
          >
            {_('如果扫描被中断，您可以尝试重新启动任务。')}
          </ReportPanel>
        )}
        {isActiveReport && progress === 1 && (
          <ReportPanel
            icon={props => <RefreshIcon {...props} />}
            title={_('扫描刚刚开始，还没有结果')}
          >
            {_('请等待扫描结果')}
          </ReportPanel>
        )}
        {isActiveReport && progress > 1 && (
          <ReportPanel
            icon={props => <RefreshIcon {...props} />}
            title={_(
              '扫描仍在运行，尚无结果',
            )}
          >
            {_('请等待扫描结果')}
          </ReportPanel>
        )}
        {progress < 1 && hasTarget && (
          <ReportPanel
            icon={props => <TargetIcon {...props} />}
            title={_('目标主机无法连接')}
            onClick={may_edit_target ? onTargetEditClick : undefined}
          >
            {_(
              '您应该更改目标的“有效测试方法”以进行下一次扫描。' +
                '但是，如果目标主机无法访问，则扫描持续时间可能会显著增加。',
            )}
          </ReportPanel>
        )}
      </Divider>
    </Divider>
  );
};

EmptyReport.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  hasTarget: PropTypes.bool,
  progress: PropTypes.numberOrNumberString,
  status: PropTypes.string.isRequired,
  onTargetEditClick: PropTypes.func.isRequired,
};

export default withCapabilities(EmptyReport);

// vim: set ts=2 sw=2 tw=80:
