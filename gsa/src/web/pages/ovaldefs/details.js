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

import SeverityBar from 'web/components/bar/severitybar';

import Layout from 'web/components/layout/layout';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import {Col} from 'web/entity/page';

const OvaldefDetails = ({entity}) => {
  const {
    title,
    severity,
    version,
    cve_refs,
    deprecation,
    file,
    metadata,
  } = entity;
  return (
    <Layout flex="column" grow="1">
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          {isDefined(title) && (
            <TableRow>
              <TableData>{_('标题')}</TableData>
              <TableData>{title}</TableData>
            </TableRow>
          )}

          {isDefined(version) && (
            <TableRow>
              <TableData>{_('版本')}</TableData>
              <TableData>{version}</TableData>
            </TableRow>
          )}

          {isDefined(entity.class) && (
            <TableRow>
              <TableData>{_('定义类别')}</TableData>
              <TableData>{entity.class}</TableData>
            </TableRow>
          )}

          {isDefined(cve_refs) && (
            <TableRow>
              <TableData>{_('引用的CVE')}</TableData>
              <TableData>{cve_refs}</TableData>
            </TableRow>
          )}

          <TableRow>
            <TableData>{_('严重程度')}</TableData>
            <TableData>
              <SeverityBar severity={severity} />
            </TableData>
          </TableRow>

          {isDefined(entity.isDeprecated) && entity.isDeprecated() && (
            <TableRow>
              <TableData>{_('不推荐使用')}</TableData>
              <TableData>{deprecation}</TableData>
            </TableRow>
          )}

          {isDefined(file) && (
            <TableRow>
              <TableData>{_('文件')}</TableData>
              <TableData>{file}</TableData>
            </TableRow>
          )}
        </TableBody>
      </InfoTable>

      {isDefined(metadata) && (
        <div>
          <h2>{_('描述')}</h2>
          <p>
            {isDefined(metadata.description) ? metadata.description : _('None')}
          </p>
        </div>
      )}
    </Layout>
  );
};

OvaldefDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default OvaldefDetails;

// vim: set ts=2 sw=2 tw=80:
