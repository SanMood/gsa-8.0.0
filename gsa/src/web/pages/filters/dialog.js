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

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';

import SaveDialog from 'web/components/dialog/savedialog';

import FormGroup from 'web/components/form/formgroup';
import TextField from 'web/components/form/textfield';
import Select from 'web/components/form/select';

const FilterDialog = ({
  comment = '',
  id,
  name = _('未命名'),
  term = '',
  title = _('新建过滤器'),
  type,
  types,
  onClose,
  onSave,
}) => {
  const filterOptions = types.map(option => ({
    value: option[0],
    label: option[1],
  }));

  return (
    <SaveDialog
      title={title}
      onClose={onClose}
      onSave={onSave}
      defaultValues={{
        comment,
        id,
        name,
        term,
        type,
      }}
    >
      {({values: state, onValueChange}) => {
        return (
          <Layout flex="column">
            <FormGroup title={_('名称')}>
              <TextField
                name="name"
                grow="1"
                value={state.name}
                size="30"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('备注')}>
              <TextField
                name="comment"
                grow="1"
                value={state.comment}
                size="30"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('期限')}>
              <TextField
                name="term"
                grow="1"
                value={state.term}
                size="30"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('类型')}>
              <Select
                name="type"
                items={filterOptions}
                onChange={onValueChange}
                value={state.type}
              />
            </FormGroup>
          </Layout>
        );
      }}
    </SaveDialog>
  );
};

FilterDialog.propTypes = {
  comment: PropTypes.string,
  filter: PropTypes.model,
  id: PropTypes.string,
  name: PropTypes.string,
  term: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  types: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default FilterDialog;

// vim: set ts=2 sw=2 tw=80:
