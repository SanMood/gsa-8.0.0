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

import _ from 'gmp/locale';

import {
  esxi_credential_filter,
  smb_credential_filter,
  ssh_credential_filter,
} from 'gmp/models/credential';

import PropTypes from 'web/utils/proptypes';
import {renderSelectItems} from 'web/utils/render';
import withCapabilities from 'web/utils/withCapabilities';

import SaveDialog from 'web/components/dialog/savedialog';

import Divider from 'web/components/layout/divider';

import Select from 'web/components/form/select';
import Spinner from 'web/components/form/spinner';
import FormGroup from 'web/components/form/formgroup';
import TextField from 'web/components/form/textfield';
import Radio from 'web/components/form/radio';
import Datepicker from 'web/components/form/datepicker';
import TimeZoneSelect from 'web/components/form/timezoneselect';

import Layout from 'web/components/layout/layout';

import {WizardContent, WizardIcon} from './taskwizard';

const IMMEDIATELY_START_VALUE = '2';
const SCHEDULE_START_VALUE = '1';
const DONT_START_VALUE = '0';

const DEFAULTS = {
  scan_configs: [],
  credentials: [],
  auto_start: '2',
  ssh_port: 22,
};

const AdvancedTaskWizard = ({
  alert_email,
  auto_start,
  capabilities,
  config_id,
  credentials = [],
  start_date,
  esxi_credential = '',
  scan_configs,
  smb_credential = '',
  ssh_credential = '',
  ssh_port,
  start_hour,
  start_minute,
  start_timezone,
  target_hosts,
  task_name,
  onClose,
  onSave,
}) => {
  const configItems = renderSelectItems(scan_configs);
  const sshCredentialItems = renderSelectItems(
    credentials.filter(ssh_credential_filter),
    '',
  );
  const smbCredentialItems = renderSelectItems(
    credentials.filter(smb_credential_filter),
    '',
  );
  const esxiCredentialItems = renderSelectItems(
    credentials.filter(esxi_credential_filter),
    '',
  );

  const data = {
    alert_email,
    auto_start,
    config_id,
    credentials,
    start_date,
    esxi_credential,
    scan_configs,
    smb_credential,
    ssh_credential,
    ssh_port,
    start_hour,
    start_minute,
    start_timezone,
    target_hosts,
    task_name,
    ...DEFAULTS,
  };

  return (
    <SaveDialog
      buttonTitle={_('创建')}
      title={_('高级任务向导')}
      width="900px"
      onClose={onClose}
      onSave={onSave}
      defaultValues={data}
    >
      {({values: state, onValueChange}) => (
        <Layout align={['start', 'start']}>
          <WizardIcon />
          <Layout basis="35%">
            <WizardContent>
              <p>
                <b>{_('快速入门：创建新任务')}</b>
              </p>
              <p>
                {_(
                  'GSA可以帮助您创建一个新的扫描任务并自动启动它。',
                )}
              </p>
              <p>
                {_(
                  '您只要输入新任务的名称和目标的IP地址或主机名，' +
                    '然后选择扫描配置。',
                )}
              </p>
              <p>
                {_(
                  '您可以选择是希望GSA立即运行扫描，' +
                    '将任务安排在以后的日期和时间，' +
                    '还是选择创建任务以便以后手动运行。',
                )}
              </p>
              <p>
                {_(
                  '要运行经过身份验证的扫描，' +
                    '必须选择SSH或SMB凭据，' +
                    '但也可以通过不选择任何凭据来运行未经身份验证的扫描。',
                )}
                {capabilities.mayAccess('alerts') &&
                  capabilities.mayCreate('alert') && <br />}
                {capabilities.mayAccess('alerts') &&
                  capabilities.mayCreate('alert') &&
                  _(
                    '如果在“电子邮件报告收件人”字段中输入电子邮件地址，' +
                      '扫描报告完成后将发送到此地址。',
                  )}
                {capabilities.mayAccess('slaves') && <br />}
                {capabilities.mayAccess('slaves') &&
                  _(
                    '最后，您可以选择一个运行扫描的从站。',
                  )}
              </p>
              <p>
                {_(
                  '对于其他设置，我将应用“我的设置”中的默认设置。',
                )}
              </p>
            </WizardContent>
          </Layout>
          <Layout grow="1" basis="0" flex="column">
            <FormGroup title={_('任务名称')} titleSize="3">
              <TextField
                name="task_name"
                grow="1"
                onChange={onValueChange}
                value={state.task_name}
                size="30"
                maxLength="80"
              />
            </FormGroup>

            <FormGroup title={_('扫描配置')} titleSize="3">
              <Select
                name="config_id"
                value={state.config_id}
                items={configItems}
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('目标主机')} titleSize="3">
              <TextField
                name="target_hosts"
                grow="1"
                onChange={onValueChange}
                value={state.target_hosts}
                maxLength="2000"
              />
            </FormGroup>

            <FormGroup title={_('开始时间')} titleSize="3" flex="column">
              <FormGroup>
                <Radio
                  title={_('立即开始')}
                  value={IMMEDIATELY_START_VALUE}
                  checked={state.auto_start === IMMEDIATELY_START_VALUE}
                  name="auto_start"
                  onChange={onValueChange}
                />
              </FormGroup>
              <FormGroup>
                <Radio
                  title={_('创建计划：')}
                  value={SCHEDULE_START_VALUE}
                  checked={state.auto_start === SCHEDULE_START_VALUE}
                  name="auto_start"
                  onChange={onValueChange}
                />
              </FormGroup>
              <FormGroup offset="1">
                <Datepicker
                  name="start_date"
                  value={state.start_date}
                  onChange={onValueChange}
                />
              </FormGroup>
              <FormGroup offset="1">
                <Divider>
                  <span>{_('在')}</span>
                  <Spinner
                    type="int"
                    min="0"
                    max="23"
                    size="2"
                    name="start_hour"
                    value={state.start_hour}
                    onChange={onValueChange}
                  />
                  <span>{_('h')}</span>
                  <Spinner
                    type="int"
                    min="0"
                    max="59"
                    size="2"
                    name="start_minute"
                    value={state.start_minute}
                    onChange={onValueChange}
                  />
                  <span>{_('m')}</span>
                </Divider>
              </FormGroup>
              <FormGroup offset="1">
                <TimeZoneSelect
                  name="start_timezone"
                  value={state.start_timezone}
                  onChange={onValueChange}
                />
              </FormGroup>

              <Radio
                title={_('不自动启动')}
                value={DONT_START_VALUE}
                checked={state.auto_start === DONT_START_VALUE}
                name="auto_start"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('SSH凭据')} titleSize="3">
              <Divider>
                <Select
                  value={state.ssh_credential}
                  name="ssh_credential"
                  items={sshCredentialItems}
                  onChange={onValueChange}
                />
                <span>{_('端口')}</span>
                <Spinner
                  min="0"
                  max="65535"
                  size="5"
                  value={state.ssh_port}
                  onChange={onValueChange}
                />
              </Divider>
            </FormGroup>

            <FormGroup title={_('SMB凭据')} titleSize="3">
              <Select
                value={state.smb_credential}
                name="smb_credential"
                items={smbCredentialItems}
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('ESXi凭据')} titleSize="3">
              <Select
                value={state.esxi_credential}
                name="esxi_credential"
                items={esxiCredentialItems}
                onChange={onValueChange}
              />
            </FormGroup>

            {capabilities.mayCreate('alert') &&
              capabilities.mayAccess('alerts') && (
                <FormGroup title={_('通过电子邮件将报告发送给')} titleSize="3">
                  <TextField
                    name="alert_email"
                    grow="1"
                    value={state.alert_email}
                    size="30"
                    maxLength="80"
                    onChange={onValueChange}
                  />
                </FormGroup>
              )}
          </Layout>
        </Layout>
      )}
    </SaveDialog>
  );
};

AdvancedTaskWizard.propTypes = {
  alert_email: PropTypes.string,
  auto_start: PropTypes.oneOf([
    IMMEDIATELY_START_VALUE,
    SCHEDULE_START_VALUE,
    DONT_START_VALUE,
  ]),
  capabilities: PropTypes.capabilities.isRequired,
  config_id: PropTypes.idOrZero,
  credentials: PropTypes.arrayOf(PropTypes.model),
  esxi_credential: PropTypes.idOrZero,
  scan_configs: PropTypes.arrayOf(PropTypes.model),
  smb_credential: PropTypes.idOrZero,
  ssh_credential: PropTypes.idOrZero,
  ssh_port: PropTypes.number,
  start_date: PropTypes.date,
  start_hour: PropTypes.number,
  start_minute: PropTypes.number,
  start_timezone: PropTypes.string,
  target_hosts: PropTypes.string,
  task_name: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default withCapabilities(AdvancedTaskWizard);

// vim: set ts=2 sw=2 tw=80:
