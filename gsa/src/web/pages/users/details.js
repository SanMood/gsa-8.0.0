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

import {
  AUTH_METHOD_LDAP,
  AUTH_METHOD_RADIUS,
  ACCESS_ALLOW_ALL,
  ACCESS_DENY_ALL,
} from 'gmp/models/user';

import PropTypes from 'web/utils/proptypes';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import {Col} from 'web/entity/page';

export const convert_auth_method = auth_method => {
  if (auth_method === AUTH_METHOD_LDAP) {
    return _('LDAP');
  }
  if (auth_method === AUTH_METHOD_RADIUS) {
    return _('RADIUS');
  }
  return _('本地');
};

export const convert_allow = ({addresses, allow}) => {
  if (allow === ACCESS_ALLOW_ALL) {
    if (addresses.length === 0) {
      return _('允许所有');
    }
    return _('允许所有，除{{addresses}}之外', {
      addresses: addresses.join(', '),
    });
  }
  if (allow === ACCESS_DENY_ALL) {
    if (addresses.length === 0) {
      return _('拒绝所有');
    }
    return _('拒绝所有，除{{addresses}}之外', {
      addresses: addresses.join(', '),
    });
  }
  return '';
};

const UserDetails = ({entity, links = true}) => {
  const {
    auth_method,
    comment,
    groups = [],
    hosts = {},
    ifaces = [],
    roles = [],
  } = entity;
  return (
    <Layout grow flex="column">
      <InfoTable>
        <colgroup>
          <Col width="10%" />
          <Col width="90%" />
        </colgroup>
        <TableBody>
          <TableRow>
            <TableData>{_('备注')}</TableData>
            <TableData>{comment}</TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('角色')}</TableData>
            <TableData>
              <Divider>
                {roles.map(role => (
                  <DetailsLink
                    textOnly={!links}
                    key={role.id}
                    type="role"
                    id={role.id}
                  >
                    {role.name}
                  </DetailsLink>
                ))}
              </Divider>
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('组')}</TableData>
            <TableData>
              <Divider>
                {groups.map(group => (
                  <DetailsLink
                    textOnly={!links}
                    type="group"
                    key={group.id}
                    id={group.id}
                  >
                    {group.name}
                  </DetailsLink>
                ))}
              </Divider>
            </TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('主机访问')}</TableData>
            <TableData>{convert_allow(hosts)}</TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('接口访问')}</TableData>
            <TableData>{convert_allow(ifaces)}</TableData>
          </TableRow>

          <TableRow>
            <TableData>{_('认证类型')}</TableData>
            <TableData>{convert_auth_method(auth_method)}</TableData>
          </TableRow>
        </TableBody>
      </InfoTable>
    </Layout>
  );
};

UserDetails.propTypes = {
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
};

export default UserDetails;

// vim: set ts=2 sw=2 tw=80:
