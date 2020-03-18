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

import styled from 'styled-components';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import {
  EMAIL_NOTICE_ATTACH,
  EMAIL_NOTICE_INCLUDE,
  METHOD_TYPE_ALEMBA_VFIRE,
  METHOD_TYPE_SCP,
  METHOD_TYPE_SEND,
  METHOD_TYPE_SNMP,
  METHOD_TYPE_SYSLOG,
  METHOD_TYPE_EMAIL,
  METHOD_TYPE_START_TASK,
  METHOD_TYPE_HTTP_GET,
  METHOD_TYPE_SOURCEFIRE,
  METHOD_TYPE_VERINICE,
} from 'gmp/models/alert';

import PropTypes from 'web/utils/proptypes';

import DetailsLink from 'web/components/link/detailslink';

import SimpleTable from 'web/components/table/simpletable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import {Col} from 'web/entity/page';

const Table = styled(SimpleTable)`
  margin-top: 5px;
  margin-left: 45px;
  width: 100%;
  & td {
    padding: 0;
  }
`;

const Method = ({method, details = false}) => {
  let url = '';
  if (method.type === METHOD_TYPE_ALEMBA_VFIRE) {
    const {data = {}} = method;
    if (details) {
      return (
        <div>
          <div>{_('Alemba vFire')}</div>
          <Table>
            <colgroup>
              <Col width="12%" />
              <Col width="88%" />
            </colgroup>
            <TableBody>
              {isDefined(data.vfire_base_url) &&
                isDefined(data.vfire_base_url.value) && (
                  <TableRow>
                    <TableData>{_('基本URL')}</TableData>
                    <TableData>{data.vfire_base_url.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_call_description) &&
                isDefined(data.vfire_call_description.value) && (
                  <TableRow>
                    <TableData>{_('调用说明')}</TableData>
                    <TableData>{data.vfire_call_description.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_call_impact_name) &&
                isDefined(data.vfire_call_impact_name.value) && (
                  <TableRow>
                    <TableData>{_('影响')}</TableData>
                    <TableData>{data.vfire_call_impact_name.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_call_partition_name) &&
                isDefined(data.vfire_call_partition_name.value) && (
                  <TableRow>
                    <TableData>{_('分区')}</TableData>
                    <TableData>
                      {data.vfire_call_partition_name.value}
                    </TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_call_template_name) &&
                isDefined(data.vfire_call_template_name.value) && (
                  <TableRow>
                    <TableData>{_('调用模板')}</TableData>
                    <TableData>{data.vfire_call_template_name.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_call_type_name) &&
                isDefined(data.vfire_call_type_name.value) && (
                  <TableRow>
                    <TableData>{_('调用类型')}</TableData>
                    <TableData>{data.vfire_call_type_name.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_call_urgency_name) &&
                isDefined(data.vfire_call_urgency_name.value) && (
                  <TableRow>
                    <TableData>{_('紧急性')}</TableData>
                    <TableData>{data.vfire_call_urgency_name.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_client_id) &&
                isDefined(data.vfire_client_id.value) && (
                  <TableRow>
                    <TableData>{_('Alemba客户ID')}</TableData>
                    <TableData>{data.vfire_client_id.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.vfire_session_type) &&
                isDefined(data.vfire_session_type.value) && (
                  <TableRow>
                    <TableData>{_('会话类型')}</TableData>
                    <TableData>{data.vfire_session_type.value}</TableData>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      );
    }
    return _('Alemba vFire');
  }

  if (method.type === METHOD_TYPE_SCP) {
    const {data = {}} = method;
    const {scp_credential = {}} = data;
    const {credential} = scp_credential;

    if (details) {
      return (
        <div>
          <div>{_('SCP')}</div>
          <Table>
            <colgroup>
              <Col width="12%" />
              <Col width="88%" />
            </colgroup>
            <TableBody>
              {isDefined(data.scp_host) && isDefined(data.scp_host.value) && (
                <TableRow>
                  <TableData>{_('主机')}</TableData>
                  <TableData>{data.scp_host.value}</TableData>
                </TableRow>
              )}

              {isDefined(credential) && isDefined(credential.id) && (
                <TableRow>
                  <TableData>{_('凭据')}</TableData>
                  <TableData>
                    <DetailsLink id={credential.id} type="credential">
                      {credential.name}
                    </DetailsLink>
                  </TableData>
                </TableRow>
              )}

              {isDefined(credential) && isDefined(credential.login) && (
                <TableRow>
                  <TableData>{_('登录')}</TableData>
                  <TableData>{credential.login}</TableData>
                </TableRow>
              )}

              {isDefined(data.scp_known_hosts) &&
                isDefined(data.scp_known_hosts.value) && (
                  <TableRow>
                    <TableData>{_('已知主机')}</TableData>
                    <TableData>{data.scp_known_hosts.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.scp_path) && isDefined(data.scp_path.value) && (
                <TableRow>
                  <TableData>{_('路径')}</TableData>
                  <TableData>{data.scp_path.value}</TableData>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      );
    }

    if (isDefined(credential) && isDefined(credential)) {
      url += credential.login;
    } else {
      url += _('(凭据不可用)');
    }

    url += '@';

    if (isDefined(data.scp_host)) {
      url += data.scp_host.value;
    }
    if (isDefined(data.scp_path)) {
      url += ':' + data.scp_path.value;
    }
    return _('SCP to {{- url}}', {url});
  }

  if (method.type === METHOD_TYPE_SEND) {
    url += method.data.send_host.value + ':' + method.data.send_port.value;
    return _('发送到{{- url}}', {url});
  }

  if (
    method.type === METHOD_TYPE_SYSLOG &&
    method.data.submethod.value === METHOD_TYPE_SNMP
  ) {
    return 'SNMP';
  }

  if (method.type === METHOD_TYPE_SNMP) {
    const {data} = method;
    if (details) {
      return (
        <div>
          <div>{_('SNMP')}</div>
          <Table>
            <colgroup>
              <Col width="12%" />
              <Col width="88%" />
            </colgroup>
            <TableBody>
              <TableRow>
                <TableData>{_('代理')}</TableData>
                <TableData>{data.snmp_agent.value}</TableData>
              </TableRow>

              {isDefined(data.snmp_community) &&
                isDefined(data.snmp_community.value) && (
                  <TableRow>
                    <TableData>{_('社区')}</TableData>
                    <TableData>{data.snmp_community.value}</TableData>
                  </TableRow>
                )}

              {isDefined(data.snmp_agent) && isDefined(data.snmp_agent.value) && (
                <TableRow>
                  <TableData>{_('信息 {{name}}')}</TableData>
                  <TableData>{data.snmp_message.value}</TableData>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      );
    }
    return _('SNMP to {{agent}}', {agent: data.snmp_agent.value});
  }

  if (method.type === METHOD_TYPE_EMAIL && isDefined(method.data.to_address)) {
    const {data} = method;
    // TODO improve email content info. the info depends on the event type :-/
    if (details) {
      return (
        <div>
          <div>{_('邮件')}</div>
          <Table>
            <colgroup>
              <Col width="12%" />
              <Col width="88%" />
            </colgroup>
            <TableBody>
              <TableRow>
                <TableData>{_('收件人')}</TableData>
                <TableData>{data.to_address.value}</TableData>
              </TableRow>

              <TableRow>
                <TableData>{_('发件人')}</TableData>
                <TableData>{data.from_address.value}</TableData>
              </TableRow>

              {details && isDefined(data.recipient_credential) && (
                <TableRow>
                  <TableData>{_('邮件加密')}</TableData>
                  <TableData>
                    <DetailsLink
                      id={data.recipient_credential.value}
                      type="credential"
                    >
                      {_('凭据')}
                    </DetailsLink>
                  </TableData>
                </TableRow>
              )}

              {details &&
                isDefined(data.notice) &&
                isDefined(data.notice.value) && (
                  <TableRow>
                    <TableData>{_('内容')}</TableData>
                    <TableData>
                      {data.notice.value === EMAIL_NOTICE_INCLUDE
                        ? _('包含内容')
                        : data.notice.value === EMAIL_NOTICE_ATTACH
                        ? _('附加内容')
                        : _('简单通知')}
                    </TableData>
                  </TableRow>
                )}

              {details &&
                isDefined(data.subject) &&
                isDefined(data.subject.value) && (
                  <TableRow>
                    <TableData>{_('主题')}</TableData>
                    <TableData>{data.subject.value}</TableData>
                  </TableRow>
                )}

              {details &&
                isDefined(data.message) &&
                isDefined(data.message.value) && (
                  <TableRow>
                    <TableData>{_('信息')}</TableData>
                    <TableData>{data.message.value}</TableData>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      );
    }
    return isDefined(data.recipient_credential)
      ? _('加密邮件至 {{address}}', {address: data.to_address.value})
      : _('发送邮件至 {{address}}', {address: data.to_address.value});
  }

  if (method.type === METHOD_TYPE_START_TASK) {
    // FIXME task name ist missing
    // in xslt the tasks have been added to the response
    // we should improve the backend to return the name for the task id here too
    return _('开始任务');
  }

  if (method.type === METHOD_TYPE_HTTP_GET) {
    const {data = {}} = method;

    if (isDefined(data.URL) && isDefined(data.URL.value)) {
      return _('HTTP GET request to URL {{- url}}', {url: data.URL.value});
    }

    return _('HTTP GET request');
  }

  if (method.type === METHOD_TYPE_SOURCEFIRE) {
    const {data = {}} = method;
    if (details) {
      return (
        <div>
          <div>{_('Sourcefire Connector')}</div>
          <Table>
            <colgroup>
              <Col width="12%" />
              <Col width="88%" />
            </colgroup>
            <TableBody>
              {isDefined(data.defense_center_ip) &&
                isDefined(data.defense_center_ip.value) && (
                  <TableRow>
                    <TableData>{_('安全中心IP')}</TableData>
                    <TableData>{data.defense_center_ip.value}</TableData>
                  </TableRow>
                )}
              {isDefined(data.defense_center_port) &&
                isDefined(data.defense_center_port.value) && (
                  <TableRow>
                    <TableData>{_('安全中心端口')}</TableData>
                    <TableData>{data.defense_center_port.value}</TableData>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      );
    }
    return _('Sourcefire Connector');
  }

  if (method.type === METHOD_TYPE_VERINICE) {
    const {data = {}} = method;
    const {verinice_server_credential = {}} = data;
    const {credential} = verinice_server_credential;

    if (details) {
      // TODO add verinice report format.
      // Currently we can't get the report format details
      return (
        <div>
          <div>{_('verinice Connector')}</div>
          <Table>
            <colgroup>
              <Col width="12%" />
              <Col width="88%" />
            </colgroup>
            <TableBody>
              {isDefined(data.verinice_server_url) &&
                isDefined(data.verinice_server_url.value) && (
                  <TableRow>
                    <TableData>{_('URL')}</TableData>
                    <TableData>{data.verinice_server_url.value}</TableData>
                  </TableRow>
                )}

              {isDefined(credential) && isDefined(credential.id) && (
                <TableRow>
                  <TableData>{_('证书')}</TableData>
                  <TableData>
                    <DetailsLink id={credential.id} type="credential">
                      {credential.name}
                    </DetailsLink>
                  </TableData>
                </TableRow>
              )}

              {isDefined(credential) && isDefined(credential.login) && (
                <TableRow>
                  <TableData>{_('用户名')}</TableData>
                  <TableData>{credential.login}</TableData>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      );
    }
    return _('verinice Connector');
  }

  return method.type;
};

Method.propTypes = {
  details: PropTypes.bool,
  method: PropTypes.object.isRequired,
};

export default Method;

// vim: set ts=2 sw=2 tw=80:
