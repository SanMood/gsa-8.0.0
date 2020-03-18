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

import PropTypes from '../../utils/proptypes.js';

import SeverityBar from '../../components/bar/severitybar.js';

import Layout from '../../components/layout/layout.js';

import ExternalLink from '../../components/link/externallink.js';

import InfoTable from '../../components/table/infotable.js';
import TableBody from '../../components/table/body.js';
import TableData from '../../components/table/data.js';
import TableRow from '../../components/table/row.js';

import {Col} from 'web/entity/page';

const CertBundAdvDetails = ({entity}) => {
  const {
    title,
    version,
    severity,
    software,
    platform,
    effect,
    remote_attack,
    risk,
    reference_source,
    reference_url,
  } = entity;
  return (
    <Layout flex="column" grow>
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          {isDefined(version) && (
            <TableRow>
              <TableData>{_('版本')}</TableData>
              <TableData>{version}</TableData>
            </TableRow>
          )}
          {isDefined(title) && (
            <TableRow>
              <TableData>{_('标题')}</TableData>
              <TableData>{title}</TableData>
            </TableRow>
          )}
          {isDefined(software) && (
            <TableRow>
              <TableData>{_('软件')}</TableData>
              <TableData>{software}</TableData>
            </TableRow>
          )}
          {isDefined(platform) && (
            <TableRow>
              <TableData>{_('平台')}</TableData>
              <TableData>{platform}</TableData>
            </TableRow>
          )}
          {isDefined(effect) && (
            <TableRow>
              <TableData>{_('影响')}</TableData>
              <TableData>{effect}</TableData>
            </TableRow>
          )}
          {isDefined(remote_attack) && (
            <TableRow>
              <TableData>{_('远程攻击')}</TableData>
              <TableData>{remote_attack}</TableData>
            </TableRow>
          )}
          {isDefined(severity) && (
            <TableRow>
              <TableData>{_('严重程度')}</TableData>
              <TableData>
                <SeverityBar severity={severity} />
              </TableData>
            </TableRow>
          )}
          {isDefined(risk) && (
            <TableRow>
              <TableData>{_('CERT-Bund风险等级')}</TableData>
              <TableData>{risk}</TableData>
            </TableRow>
          )}
          {isDefined(reference_source) && (
            <TableRow>
              <TableData>{_('参考资料')}</TableData>
              <TableData>{reference_source}</TableData>
            </TableRow>
          )}
          {isDefined(reference_url) && (
            <TableRow>
              <TableData>{_('参考链接')}</TableData>
              <TableData>
                <ExternalLink to={reference_url}>{reference_url}</ExternalLink>
              </TableData>
            </TableRow>
          )}
        </TableBody>
      </InfoTable>
    </Layout>
  );
};

CertBundAdvDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default CertBundAdvDetails;

// vim: set ts=2 sw=2 tw=80:
