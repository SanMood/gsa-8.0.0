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
import {
  translatedResultSeverityRiskFactor,
  LOG_VALUE,
} from 'web/utils/severity';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import EntityLink from 'web/entity/link';

import DetailsBlock from 'web/entity/block';
import NoteBox from 'web/entity/note';

import {Col} from 'web/entity/page';

const NoteDetails = ({entity}) => {
  const {hosts, port, result, severity, task} = entity;
  return (
    <Layout grow="1" flex="column">
      <DetailsBlock title={_('应用程序')}>
        <InfoTable size="full">
          <colgroup>
            <Col width="10%" />
            <Col width="90%" />
          </colgroup>
          <TableBody>
            <TableRow>
              <TableData>{_('主机')}</TableData>
              <TableData>
                {hosts.length > 0 ? (
                  <Divider>
                    {hosts.map(host => (
                      <span key={host}>{host}</span>
                    ))}
                  </Divider>
                ) : (
                  _('任意')
                )}
              </TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('端口')}</TableData>
              <TableData>{isDefined(port) ? port : _('任意')}</TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('严重程度')}</TableData>
              <TableData>
                {isDefined(severity)
                  ? severity > LOG_VALUE
                    ? _('> 0.0')
                    : translatedResultSeverityRiskFactor(severity)
                  : _('任意')}
              </TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('任务')}</TableData>
              <TableData>
                {entity.isOrphan() ? (
                  <b>{_('Orphan')}</b>
                ) : isDefined(task) ? (
                  <EntityLink entity={task} />
                ) : (
                  _('任意')
                )}
              </TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('结果')}</TableData>
              <TableData>
                {entity.isOrphan() ? (
                  <b>{_('Orphan')}</b>
                ) : isDefined(result) ? (
                  <EntityLink entity={result} />
                ) : (
                  _('任意')
                )}
              </TableData>
            </TableRow>
          </TableBody>
        </InfoTable>
      </DetailsBlock>

      <DetailsBlock
        title={
          entity.isActive() ? _('外观') : _('激活时的外观')
        }
      >
        <NoteBox note={entity} detailsLink={false} />
      </DetailsBlock>
    </Layout>
  );
};

NoteDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default NoteDetails;

// vim: set ts=2 sw=2 tw=80:
