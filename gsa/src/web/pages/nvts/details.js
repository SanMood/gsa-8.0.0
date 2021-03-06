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

import {TAG_NA} from 'gmp/models/nvt';

import PropTypes from 'web/utils/proptypes';

import DetailsBlock from 'web/entity/block';

import Severitybar from 'web/components/bar/severitybar';

import Layout from 'web/components/layout/layout';

import Link from 'web/components/link/link';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import References from './references';
import Solution from './solution';
import Pre from './preformatted';

const NvtDetails = ({entity, links = true}) => {
  const {tags = {}, severity, qod, family} = entity;
  return (
    <Layout flex="column" grow="1">
      {isDefined(tags.summary) && (
        <DetailsBlock title={_('摘要')}>
          <Pre>{tags.summary}</Pre>
        </DetailsBlock>
      )}

      <DetailsBlock title={_('得分')}>
        <InfoTable>
          <TableBody>
            <TableRow>
              <TableData>{_('CVSS基础得分')}</TableData>
              <TableData>
                <Severitybar severity={severity} />
              </TableData>
            </TableRow>

            {isDefined(tags.cvss_base_vector) &&
              tags.cvss_base_vector !== TAG_NA && (
                <TableRow>
                  <TableData>{_('CVSS基本向量')}</TableData>
                  <TableData>
                    <Link
                      to="cvsscalculator"
                      query={{cvssVector: tags.cvss_base_vector}}
                    >
                      {tags.cvss_base_vector}
                    </Link>
                  </TableData>
                </TableRow>
              )}
          </TableBody>
        </InfoTable>
      </DetailsBlock>

      {isDefined(tags.insight) && tags.insight !== TAG_NA && (
        <DetailsBlock title={_('洞察')}>
          <Pre>{tags.insight}</Pre>
        </DetailsBlock>
      )}

      {(isDefined(qod) ||
        (isDefined(tags.vuldetect) && tags.vuldetect !== TAG_NA)) && (
        <DetailsBlock title={_('检测方法')}>
          {isDefined(tags.vuldetect) && tags.vuldetect !== TAG_NA && (
            <Pre>{tags.vuldetect}</Pre>
          )}
          {isDefined(qod) && (
            <Pre>
              <b>{_('检测质量')}: </b>

              {isDefined(qod.type) ? qod.type : _('N/A')}
              {isDefined(qod.value) && ' (' + qod.value + '%)'}
            </Pre>
          )}
        </DetailsBlock>
      )}

      {isDefined(tags.affected) && tags.affected !== TAG_NA && (
        <DetailsBlock title={_('受影响的软件/操作系统')}>
          <Pre>{tags.affected}</Pre>
        </DetailsBlock>
      )}

      {isDefined(tags.impact) && tags.impact !== TAG_NA && (
        <DetailsBlock title={_('影响')}>
          <Pre>{tags.impact}</Pre>
        </DetailsBlock>
      )}

      <Solution solution={tags.solution} solutionType={tags.solution_type} />

      {isDefined(family) && (
        <DetailsBlock title={_('家族')}>
          <Link to="nvts" filter={'family="' + family + '"'} textOnly={!links}>
            {family}
          </Link>
        </DetailsBlock>
      )}

      <References links={links} nvt={entity} />
    </Layout>
  );
};

NvtDetails.propTypes = {
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
};

export default NvtDetails;

// vim: set ts=2 sw=2 tw=80:
