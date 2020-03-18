/* Copyright (C) 2017-2019  Greenbone Networks GmbH
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

import PropTypes from 'web/utils/proptypes';
import {renderSelectItems} from 'web/utils/render';

import SaveDialog from 'web/components/dialog/savedialog';

import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';

import Layout from 'web/components/layout/layout';

const ConfirmDeleteDialog = ({
  deleteUsers = [],
  inheritorId = '--',
  title,
  inheritorUsers,
  onClose,
  onSave,
}) => {
  let headline;
  if (deleteUsers.length === 1) {
    headline = _('用户{{name}}将被删除', {name: deleteUsers[0].name});
  } else if (deleteUsers.length > 1) {
    headline = _('{{count}}个用户将被删除', {
      count: deleteUsers.length,
    });
  } else {
    headline = _('1个用户将被删除');
  }

  const data = {
    deleteUsers,
    inheritorId,
  };

  const inheritingUserItems = [
    {
      label: '--',
      value: '--',
    },
    {
      label: _('当前用户'),
      value: 'self',
    },
    ...renderSelectItems(inheritorUsers),
  ];

  return (
    <SaveDialog
      buttonTitle={_('删除')}
      title={title}
      onClose={onClose}
      onSave={onSave}
      defaultValues={data}
    >
      {({values: state, onValueChange}) => {
        return (
          <Layout flex="column">
            <h2>{headline}</h2>
            <p>
              {_(
                '如果未选择任何继承用户，则所有拥有的资源也将被删除。',
              )}
            </p>
            <FormGroup title={_('继承用户')}>
              <Select
                name="inheritorId"
                items={inheritingUserItems}
                value={state.inheritorId}
                onChange={onValueChange}
              />
            </FormGroup>
          </Layout>
        );
      }}
    </SaveDialog>
  );
};

ConfirmDeleteDialog.propTypes = {
  deleteUsers: PropTypes.array.isRequired,
  inheritorId: PropTypes.id,
  inheritorUsers: PropTypes.array,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ConfirmDeleteDialog;

// vim: set ts=2 sw=2 tw=80:
