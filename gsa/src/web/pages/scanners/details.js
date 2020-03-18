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
import {dateTimeWithTimeZone} from 'gmp/locale/date';

import {isDefined} from 'gmp/utils/identity';

import {
  scannerTypeName,
  CVE_SCANNER_TYPE,
  OSP_SCANNER_TYPE,
  PARAM_TYPE_OVALDEF_FILE,
  PARAM_TYPE_SELECTION,
  PARAM_TYPE_BOOLEAN,
} from 'gmp/models/scanner';

import PropTypes from 'web/utils/proptypes';
import {renderYesNo} from 'web/utils/render';

import DetailsBlock from 'web/entity/block';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import InfoTable from 'web/components/table/infotable';
import SimpleTable from 'web/components/table/simpletable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';

import {Col} from 'web/entity/page';

const CertInfo = ({info}) => {
  const {activationTime, expirationTime, issuer, md5_fingerprint} = info;
  return (
    <InfoTable>
      <colgroup>
        <Col width="10%" />
        <Col width="90%" />
      </colgroup>
      <TableBody>
        <TableRow>
          <TableData>{_('激活')}</TableData>
          <TableData>{dateTimeWithTimeZone(activationTime)}</TableData>
        </TableRow>

        <TableRow>
          <TableData>{_('期满')}</TableData>
          <TableData>{dateTimeWithTimeZone(expirationTime)}</TableData>
        </TableRow>

        <TableRow>
          <TableData>{_('MD5指纹')}</TableData>
          <TableData>{md5_fingerprint}</TableData>
        </TableRow>

        <TableRow>
          <TableData>{_('发证单位')}</TableData>
          <TableData>{issuer}</TableData>
        </TableRow>
      </TableBody>
    </InfoTable>
  );
};

CertInfo.propTypes = {
  info: PropTypes.object.isRequired,
};

const OspScannerDetails = ({info}) => {
  const {scanner, daemon, protocol, description, params = []} = info;
  if (isDefined(scanner.name)) {
    return (
      <div>
        <DetailsBlock title={_('OSP扫描仪详细信息')}>
          <InfoTable>
            <colgroup>
              <Col width="10%" />
              <Col width="90%" />
            </colgroup>
            <TableBody>
              <TableRow>
                <TableData>{_('扫描仪名称')}</TableData>
                <TableData>{scanner.name}</TableData>
              </TableRow>

              <TableRow>
                <TableData>{_('扫描仪版本')}</TableData>
                <TableData>{scanner.version}</TableData>
              </TableRow>

              <TableRow>
                <TableData>{_('OSP后台程序')}</TableData>
                <TableData>
                  <span>
                    {daemon.name} {daemon.version}
                  </span>
                </TableData>
              </TableRow>

              <TableRow>
                <TableData>{_('协议')}</TableData>
                <TableData>
                  <span>
                    {protocol.name} {protocol.version}
                  </span>
                </TableData>
              </TableRow>
            </TableBody>
          </InfoTable>
        </DetailsBlock>

        <DetailsBlock title={_('说明')}>
          <pre>{description}</pre>
        </DetailsBlock>

        <DetailsBlock title={_('扫描仪参数')}>
          <SimpleTable>
            <TableHeader>
              <TableRow>
                <TableHead>{_('名称')}</TableHead>
                <TableHead>{_('说明')}</TableHead>
                <TableHead>{_('类型')}</TableHead>
                <TableHead>{_('预置值')}</TableHead>
                <TableHead>{_('强制性')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.map(param => {
                const {param_type} = param;
                let {default: def} = param;
                if (param_type === PARAM_TYPE_OVALDEF_FILE) {
                  def = _('OVAL定义文件列表');
                } else if (param_type === PARAM_TYPE_SELECTION) {
                  def = _('列表');
                } else if (param_type === PARAM_TYPE_BOOLEAN) {
                  def = renderYesNo(def);
                }
                return (
                  <TableRow key={param.name}>
                    <TableData>{param.name}</TableData>
                    <TableData>{param.description}</TableData>
                    <TableData>{param_type}</TableData>
                    <TableData>{def}</TableData>
                    <TableData>{renderYesNo(param.mandatory)}</TableData>
                  </TableRow>
                );
              })}
            </TableBody>
          </SimpleTable>
        </DetailsBlock>
      </div>
    );
  }
  return <h2>{_('OSP扫描仪脱机')}</h2>;
};

OspScannerDetails.propTypes = {
  info: PropTypes.object.isRequired,
};

const ScannerDetails = ({entity}) => {
  const {
    comment,
    scannerType,
    host,
    port,
    credential,
    tasks = [],
    configs = [],
    info,
  } = entity;
  return (
    <Layout flex="column" grow>
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          {isDefined(comment) && (
            <TableRow>
              <TableData>{_('备注')}</TableData>
              <TableData>{comment}</TableData>
            </TableRow>
          )}

          <TableRow>
            <TableData>{_('扫描仪类型')}</TableData>
            <TableData>{scannerTypeName(scannerType)}</TableData>
          </TableRow>

          {!entity.hasUnixSocket() && (
            <TableRow>
              <TableData>{_('主机')}</TableData>
              <TableData>
                {scannerType === CVE_SCANNER_TYPE ? (
                  <span>{_('N/A（内置扫描仪）')}</span>
                ) : (
                  host
                )}
              </TableData>
            </TableRow>
          )}

          {!entity.hasUnixSocket() && (
            <TableRow>
              <TableData>{_('端口')}</TableData>
              <TableData>
                {scannerType === CVE_SCANNER_TYPE ? (
                  <span>{_('N/A（内置扫描仪）')}</span>
                ) : (
                  port
                )}
              </TableData>
            </TableRow>
          )}

          {isDefined(credential) && (
            <TableRow>
              <TableData>{_('证书')}</TableData>
              <TableData>
                <DetailsLink id={credential.id} type="credential">
                  {credential.name}
                </DetailsLink>
              </TableData>
            </TableRow>
          )}

          {tasks.length > 0 && (
            <TableRow>
              <TableData>{_('使用此扫描仪的任务')}</TableData>
              <TableData>
                <Divider wrap>
                  {tasks.map(task => (
                    <DetailsLink key={task.id} id={task.id} type="task">
                      {task.name}
                    </DetailsLink>
                  ))}
                </Divider>
              </TableData>
            </TableRow>
          )}

          {configs.length > 0 && (
            <TableRow>
              <TableData>{_('使用此扫描仪扫描配置')}</TableData>
              <TableData>
                <Divider wrap>
                  {configs.map(config => (
                    <DetailsLink
                      key={config.id}
                      id={config.id}
                      type="scanconfig"
                    >
                      {config.name}
                    </DetailsLink>
                  ))}
                </Divider>
              </TableData>
            </TableRow>
          )}
        </TableBody>
      </InfoTable>

      {scannerType === OSP_SCANNER_TYPE && isDefined(info) && (
        <OspScannerDetails info={info} />
      )}

      {!entity.hasUnixSocket() &&
        isDefined(credential) &&
        isDefined(credential.certificate_info) && (
          <DetailsBlock title={_('客户端证书（来自凭据）')}>
            <CertInfo info={credential.certificate_info} />
          </DetailsBlock>
        )}
    </Layout>
  );
};

ScannerDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default ScannerDetails;

// vim: set ts=2 sw=2 tw=80:
