/* Copyright (C) 2019 Greenbone Networks GmbH
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

import PropTypes from 'web/utils/proptypes';

import Checkbox from 'web/components/form/checkbox';
import TextField from 'web/components/form/textfield';
import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

const StyledLayout = styled(Layout)`
  margin-top: 15px;
`;

const CreateNamedFilterGroup = ({
  filterName,
  saveNamedFilter = false,
  onValueChange,
}) => (
  <StyledLayout>
    <Divider>
      <Checkbox
        data-testid="createnamedfiltergroup-checkbox"
        name="saveNamedFilter"
        checkedValue={true}
        unCheckedValue={false}
        checked={saveNamedFilter}
        title={_('将过滤器存储为：')}
        onChange={onValueChange}
      />
      <TextField
        data-testid="createnamedfiltergroup-textfield"
        disabled={!saveNamedFilter}
        name="filterName"
        size="20"
        maxLength="80"
        title={_('过滤器名称')}
        value={filterName}
        onChange={onValueChange}
      />
    </Divider>
  </StyledLayout>
);

CreateNamedFilterGroup.propTypes = {
  filterName: PropTypes.string,
  saveNamedFilter: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
};

export default CreateNamedFilterGroup;

// vim: set ts=2 sw=2 tw=80:
