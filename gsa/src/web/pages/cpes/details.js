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
import {longDate} from 'gmp/locale/date';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes.js';

import SeverityBar from 'web/components/bar/severitybar.js';

import Layout from 'web/components/layout/layout.js';

import InfoTable from 'web/components/table/infotable.js';
import TableBody from 'web/components/table/body.js';
import TableData from 'web/components/table/data.js';
import TableRow from 'web/components/table/row.js';

import {Col} from 'web/entity/page';

const CpeDetails = ({entity}) => {
  const {title, nvd_id, deprecated_by, updateTime, status, severity} = entity;
  return (
    <Layout flex="column" grow="1">
      {!isDefined(title) && (
        <p>
          {_(
            '该CPE没有出现在CPE词典中，但被一个或多个CVE引用',
          )}
        </p>
      )}

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
          {isDefined(nvd_id) && (
            <TableRow>
              <TableData>{_('NVD ID')}</TableData>
              <TableData>{nvd_id}</TableData>
            </TableRow>
          )}
          {isDefined(deprecated_by) && (
            <TableRow>
              <TableData>{_('Deprectated By')}</TableData>
              <TableData>{deprecated_by}</TableData>
            </TableRow>
          )}
          {isDefined(updateTime) && (
            <TableRow>
              <TableData>{_('上次更新时间')}</TableData>
              <TableData>{longDate(updateTime)}</TableData>
            </TableRow>
          )}
          {isDefined(status) && (
            <TableRow>
              <TableData>{_('状态')}</TableData>
              <TableData>{status}</TableData>
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
        </TableBody>
      </InfoTable>
    </Layout>
  );
};

CpeDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default CpeDetails;

// vim: set ts=2 sw=2 tw=80:
