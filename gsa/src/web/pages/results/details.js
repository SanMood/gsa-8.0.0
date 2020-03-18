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
import 'core-js/fn/string/starts-with';

import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';
import {isEmpty} from 'gmp/utils/string';

import {TAG_NA} from 'gmp/models/nvt';

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';
import {renderNvtName} from 'web/utils/render';

import DetailsBlock from 'web/entity/block';
import {Col} from 'web/entity/page';

import DetailsLink from 'web/components/link/detailslink';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import References from '../nvts/references';
import Solution from '../nvts/solution';
import P from '../nvts/preformatted';

/*
 security and log messages from nvts are converted to results
 results should preserve newlines AND whitespaces for formatting
*/
const Pre = styled.pre`
  white-space: pre-wrap;
  word-wrap: normal;
`;

const ResultDetails = ({className, links = true, entity}) => {
  const result = entity;

  const {nvt} = result;
  const {oid, tags} = nvt;

  const is_oval = isDefined(oid) && oid.startsWith('oval:');
  const has_detection =
    isDefined(result.detection) && isDefined(result.detection.result);

  const detection_details = has_detection
    ? result.detection.result.details
    : undefined;

  return (
    <Layout flex="column" grow="1" className={className}>
      <DetailsBlock title={_('摘要')}>
        <P>{tags.summary}</P>
      </DetailsBlock>

      <DetailsBlock title={_('检测结果')}>
        {!isEmpty(result.description) && result.description.length > 1 ? (
          <Pre>{result.description}</Pre>
        ) : (
          _(
            '根据检测方法检测漏洞。',
          )
        )}
      </DetailsBlock>

      {has_detection && (
        <DetailsBlock title={_('产品检测结果')}>
          <InfoTable>
            <TableBody>
              <TableRow>
                <TableData>{_('产品')}</TableData>
                <TableData>
                  <DetailsLink
                    type="cpe"
                    id={detection_details.product}
                    textOnly={!links}
                  >
                    {detection_details.product}
                  </DetailsLink>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>{_('方法')}</TableData>
                <TableData>
                  <DetailsLink
                    id={detection_details.source_oid}
                    type={
                      detection_details.source_oid.startsWith('CVE-')
                        ? 'cve'
                        : 'nvt'
                    }
                    textOnly={!links}
                  >
                    {detection_details.source_name +
                      ' (OID: ' +
                      detection_details.source_oid +
                      ')'}
                  </DetailsLink>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>{_('日志')}</TableData>
                <TableData>
                  <DetailsLink
                    type="result"
                    id={result.detection.result.id}
                    textOnly={!links}
                  >
                    {_('查看产品检测的详细信息')}
                  </DetailsLink>
                </TableData>
              </TableRow>
            </TableBody>
          </InfoTable>
        </DetailsBlock>
      )}

      {isDefined(tags.insight) && tags.insight !== TAG_NA && (
        <DetailsBlock title={_('洞察')}>
          <P>{tags.insight}</P>
        </DetailsBlock>
      )}

      <DetailsBlock title={_('检测方法')}>
        <Layout flex="column">
          <Layout>{tags.vuldetect}</Layout>
          <InfoTable>
            <colgroup>
              <Col width="10%" />
              <Col width="90%" />
            </colgroup>
            <TableBody>
              <TableRow>
                <TableData>{_('详情：')}</TableData>
                <TableData>
                  {is_oval && (
                    <DetailsLink
                      type="ovaldef"
                      id={oid}
                      title={_('查看OVAL定义{{oid}}的详细信息', {
                        oid,
                      })}
                      textOnly={!links}
                    >
                      {oid}
                    </DetailsLink>
                  )}
                  {isDefined(oid) && oid.startsWith('1.3.6.1.4.1.25623.1.0.') && (
                    <DetailsLink type="nvt" id={oid} textOnly={!links}>
                      {renderNvtName(oid, nvt.name)}
                      {' OID: ' + oid}
                    </DetailsLink>
                  )}
                  {!isDefined(oid) &&
                    _('此方法没有详细信息')}
                </TableData>
              </TableRow>
              {!isEmpty(result.scan_nvt_version) && (
                <TableRow>
                  <TableData>{_('使用的版本：')}</TableData>
                  <TableData>{result.scan_nvt_version}</TableData>
                </TableRow>
              )}
            </TableBody>
          </InfoTable>
        </Layout>
      </DetailsBlock>

      {isDefined(tags.affected) && tags.affected !== TAG_NA && (
        <DetailsBlock title={_('受影响的软件/操作系统')}>
          <P>{tags.affected}</P>
        </DetailsBlock>
      )}

      {isDefined(tags.impact) && tags.impact !== TAG_NA && (
        <DetailsBlock title={_('影响')}>
          <P>{tags.impact}</P>
        </DetailsBlock>
      )}

      <Solution solution={tags.solution} solutionType={tags.solution_type} />

      <References links={links} nvt={nvt} />
    </Layout>
  );
};

ResultDetails.propTypes = {
  className: PropTypes.string,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
};

export default ResultDetails;

// vim: set ts=2 sw=2 tw=80:
