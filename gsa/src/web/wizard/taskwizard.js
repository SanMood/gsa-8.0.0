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

import styled from 'styled-components';

import _ from 'gmp/locale';

import PropTypes from 'web/utils/proptypes';

import SaveDialog from 'web/components/dialog/savedialog';

import TextField from 'web/components/form/textfield';

import {default as WizIcon} from 'web/components/icon/wizardicon';
import NewIcon from 'web/components/icon/newicon';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

export const WizardContent = styled.div`
  margin: 0 20px;
`;

const IconContainer = styled.div`
  align-self: flex-start;
`;

export const WizardIcon = () => (
  <IconContainer>
    <WizIcon size="large" />
  </IconContainer>
);

const TaskWizard = ({
  hosts,
  title = _('任务向导'),
  onClose,
  onNewClick,
  onSave,
}) => (
  <SaveDialog
    buttonTitle={_('开始扫描')}
    title={title}
    onClose={onClose}
    onSave={onSave}
    defaultValues={{hosts}}
  >
    {({values: state, onValueChange}) => (
      <Layout>
        <WizardIcon />
        <WizardContent>
          <Divider flex="column">
            <p>
              <b>{_('快速入门：立即扫描IP地址')}</b>
            </p>
            <Divider>
              <span>{_('IP地址或主机名：')}</span>
              <TextField
                value={state.hosts}
                name="hosts"
                size="30"
                maxLength="2000"
                onChange={onValueChange}
              />
            </Divider>
            <div>
              {_(
                '默认地址是您的计算机或网络网关。',
              )}
            </div>
            <Layout flex="column">
              {_('作为捷径，GSA将为您做以下工作：')}
              <ol>
                <li>{_('创建新目标')}</li>
                <li>{_('创建新任务')}</li>
                <li>{_('立即启动此扫描任务')}</li>
              </ol>
            </Layout>
            <p>
              {_(
                '一旦扫描进度超过1％，' +
                '您就可以通过“报告总数”列中的链接跳转到扫描报告，' +
                '并查看到目前为止收集的结果。',
              )}
            </p>
            <p>
              {_(
                '创建目标和任务时，GSA将使用“我的设置”中配置的默认值。',
              )}
            </p>
            <Divider>
              <span>{_('通过单击“新建任务”图标')}</span>
              <NewIcon title={_('新建任务')} onClick={onNewClick} />
              <span>{_('您可以自己创建一个新任务。')}</span>
            </Divider>
          </Divider>
        </WizardContent>
      </Layout>
    )}
  </SaveDialog>
);

TaskWizard.propTypes = {
  hosts: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onNewClick: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

export default TaskWizard;

// vim: set ts=2 sw=2 tw=80:
