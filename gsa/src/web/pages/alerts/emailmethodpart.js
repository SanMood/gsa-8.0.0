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
import 'core-js/fn/string/starts-with';

import React from 'react';

import _ from 'gmp/locale';

import {isTaskEvent, isSecinfoEvent} from 'gmp/models/alert';
import {
  EMAIL_CREDENTIAL_TYPES,
  email_credential_filter,
} from 'gmp/models/credential';

import Select from 'web/components/form/select';
import FormGroup from 'web/components/form/formgroup';
import TextArea from 'web/components/form/textarea';
import TextField from 'web/components/form/textfield';
import Radio from 'web/components/form/radio';

import NewIcon from 'web/components/icon/newicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import {renderSelectItems, UNSET_VALUE} from 'web/utils/render';
import withCapabilities from 'web/utils/withCapabilities';
import withPrefix from 'web/utils/withPrefix';

const EmailMethodPart = ({
  capabilities,
  credentials = [],
  fromAddress,
  event,
  message,
  messageAttach,
  notice,
  noticeAttachFormat,
  noticeReportFormat,
  prefix,
  recipientCredential,
  reportFormats = [],
  subject,
  toAddress,
  onChange,
  onCredentialChange,
  onNewCredentialClick,
}) => {
  const taskEvent = isTaskEvent(event);
  const secinfoEvent = isSecinfoEvent(event);
  const reportFormatItems = renderSelectItems(
    reportFormats.filter(
      format =>
        (taskEvent && format.content_type.startsWith('text/')) || !taskEvent,
    ),
  );
  credentials = credentials.filter(email_credential_filter);
  return (
    <Layout flex="column" grow="1">
      <FormGroup title={_('收件人')}>
        <TextField
          grow="1"
          name={prefix + 'to_address'}
          value={toAddress}
          onChange={onChange}
        />
      </FormGroup>

      <FormGroup title={_('发件人')}>
        <TextField
          grow="1"
          name={prefix + 'from_address'}
          value={fromAddress}
          onChange={onChange}
        />
      </FormGroup>

      {(taskEvent || secinfoEvent) && (
        <FormGroup title={_('主题')}>
          <TextField
            grow="1"
            name={prefix + 'subject'}
            size="30"
            value={subject}
            onChange={onChange}
          />
        </FormGroup>
      )}

      <FormGroup title={_('邮件加密')}>
        <IconDivider>
          <Select
            name={prefix + 'recipient_credential'}
            value={recipientCredential}
            items={renderSelectItems(credentials, UNSET_VALUE)}
            onChange={onCredentialChange}
          />
          <NewIcon
            size="small"
            value={EMAIL_CREDENTIAL_TYPES}
            title={_('创建一个凭据')}
            onClick={onNewCredentialClick}
          />
        </IconDivider>
      </FormGroup>

      {(taskEvent || secinfoEvent) && (
        <FormGroup title={_('正文')} flex="column">
          <Divider flex="column" grow="1">
            <Radio
              title={_('简单通知')}
              name={prefix + 'notice'}
              checked={notice === '1'}
              value="1"
              onChange={onChange}
            />

            {capabilities.mayOp('get_report_formats') && (
              <Layout flex="column" box>
                <Divider>
                  <Radio
                    name={prefix + 'notice'}
                    title={
                      taskEvent
                        ? _('包括报告')
                        : _('在消息中包括资源列表：')
                    }
                    checked={notice === '0'}
                    value="0"
                    onChange={onChange}
                  />
                  {taskEvent && (
                    <Select
                      name={prefix + 'notice_report_format'}
                      value={noticeReportFormat}
                      items={reportFormatItems}
                      onChange={onChange}
                    />
                  )}
                </Divider>
                <TextArea
                  name={prefix + 'message'}
                  rows="8"
                  cols="50"
                  value={message}
                  onChange={onChange}
                />
              </Layout>
            )}

            {capabilities.mayOp('get_report_formats') && (
              <Layout flex="column">
                <Layout>
                  <Divider>
                    <Radio
                      name={prefix + 'notice'}
                      title={
                        taskEvent
                          ? _('附上报告')
                          : _('附上资源列表并显示以下消息：')
                      }
                      checked={notice === '2'}
                      value="2"
                      onChange={onChange}
                    />
                    {taskEvent && (
                      <Select
                        name={prefix + 'notice_attach_format'}
                        value={noticeAttachFormat}
                        items={renderSelectItems(reportFormats)}
                        onChange={onChange}
                      />
                    )}
                  </Divider>
                </Layout>
                <TextArea
                  name={prefix + 'message_attach'}
                  rows="8"
                  cols="50"
                  value={messageAttach}
                  onChange={onChange}
                />
              </Layout>
            )}
          </Divider>
        </FormGroup>
      )}
    </Layout>
  );
};

EmailMethodPart.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  credentials: PropTypes.array,
  event: PropTypes.string.isRequired,
  fromAddress: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  messageAttach: PropTypes.string.isRequired,
  notice: PropTypes.string.isRequired,
  noticeAttachFormat: PropTypes.id,
  noticeReportFormat: PropTypes.id,
  prefix: PropTypes.string.isRequired,
  recipientCredential: PropTypes.id,
  reportFormats: PropTypes.array,
  subject: PropTypes.string.isRequired,
  toAddress: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onCredentialChange: PropTypes.func,
  onNewCredentialClick: PropTypes.func,
};

export default compose(
  withCapabilities,
  withPrefix,
)(EmailMethodPart);

// vim: set ts=2 sw=2 tw=80:
