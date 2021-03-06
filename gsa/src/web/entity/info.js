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
import {dateTimeWithTimeZone} from 'gmp/locale/date';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';

import Layout from 'web/components/layout/layout';

import Theme from 'web/utils/theme';

const OwnerInfo = ({owner}) =>
  isDefined(owner) ? <span>{owner.name}</span> : <i>{_('(Global Object)')}</i>;
OwnerInfo.propTypes = {
  owner: PropTypes.object,
};

export const InfoLayout = styled(Layout)`
  border-spacing: 0px;
  color: ${Theme.mediumGray};
  font-size: 10px;

  & :nth-child(even) {
    margin-left: 3px;
  }
  & :nth-child(odd) {
    margin-left: 30px;
  }
`;

const EntityInfo = ({entity}) => {
  const {id, owner, creationTime, modificationTime} = entity;
  return (
    <InfoLayout>
      <div>{_('ID:')}</div>
      <div>{id}</div>
      <div>{_('创建时间:')}</div>
      <div>{dateTimeWithTimeZone(creationTime)}</div>
      <div>{_('修改时间:')}</div>
      <div>{dateTimeWithTimeZone(modificationTime)}</div>
      <div>{_('所有者:')}</div>
      <OwnerInfo owner={owner} />
    </InfoLayout>
  );
};

EntityInfo.propTypes = {
  className: PropTypes.string,
  entity: PropTypes.model.isRequired,
};

export default EntityInfo;

// vim: set ts=2 sw=2 tw=80:
