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

import {_, _l} from 'gmp/locale/lang';
import {shortDate} from 'gmp/locale/date';

import PropTypes from 'web/utils/proptypes';

import DownloadIcon from 'web/components/icon/downloadicon';

import Link from 'web/components/link/link';

import TableData from 'web/components/table/data';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';

import {createEntitiesTable} from 'web/entities/table';

const Header = ({
  actions = true,
  currentSortDir,
  currentSortBy,
  sort = true,
  onSortChange,
}) => {
  const sortProps = {
    currentSortDir,
    currentSortBy,
    sort,
    onSortChange,
  };
  return (
    <TableHeader>
      <TableRow>
        <TableHead {...sortProps} sortBy="dn" width={actions ? '35%' : '40%'}>
          {_('DN')}
        </TableHead>
        <TableHead {...sortProps} sortBy="serial" width="10%">
          {_('连载')}
        </TableHead>
        <TableHead {...sortProps} sortBy="notvalidbefore" width="10%">
          {_('之前无效')}
        </TableHead>
        <TableHead {...sortProps} sortBy="notvalidafter" width="10%">
          {_('之后无效')}
        </TableHead>
        <TableHead {...sortProps} sortBy="ip" width="10%">
          {_('IP')}
        </TableHead>
        <TableHead {...sortProps} sortBy="hostname" width="15%">
          {_('主机名')}
        </TableHead>
        <TableHead {...sortProps} sortBy="port" width="5%">
          {_('端口')}
        </TableHead>
        {actions && (
          <TableHead width="5%" align="center">
            {_('操作')}
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

Header.propTypes = {
  actions: PropTypes.bool,
  currentSortBy: PropTypes.string,
  currentSortDir: PropTypes.string,
  sort: PropTypes.bool,
  onSortChange: PropTypes.func,
};

const StyledSpan = styled.span`
  word-break: break-all;
`;

const Row = ({
  actions = true,
  entity,
  links = true,
  onTlsCertificateDownloadClick,
}) => {
  const {issuer, serial, notafter, notbefore, hostname, ip, port} = entity;
  return (
    <TableRow>
      <TableData>
        <StyledSpan>{issuer}</StyledSpan>
      </TableData>
      <TableData>{serial}</TableData>
      <TableData>{shortDate(notbefore)}</TableData>
      <TableData>{shortDate(notafter)}</TableData>
      <TableData>
        <Link
          to="hosts"
          filter={'name=' + ip}
          textOnly={!links}
          title={_('显示具有IP {{ip}} 的所有主机', {ip})}
        >
          {ip}
        </Link>
      </TableData>
      <TableData>{hostname}</TableData>
      <TableData>{port}</TableData>
      {actions && (
        <TableData align={['center', 'center']}>
          <DownloadIcon
            title={_('下载TLS证书')}
            value={entity}
            onClick={onTlsCertificateDownloadClick}
          />
        </TableData>
      )}
    </TableRow>
  );
};

Row.propTypes = {
  actions: PropTypes.bool,
  entity: PropTypes.object.isRequired,
  links: PropTypes.bool,
  onTlsCertificateDownloadClick: PropTypes.func,
};

export default createEntitiesTable({
  header: Header,
  emptyTitle: _l('当前无可用TLS证书'),
  row: Row,
});

// vim: set ts=2 sw=2 tw=80:
