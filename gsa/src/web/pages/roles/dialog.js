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
import {map} from 'gmp/utils/array';

import PropTypes from 'web/utils/proptypes';
import {permissionDescription} from 'web/utils/render';

import SaveDialog from 'web/components/dialog/savedialog';

import Button from 'web/components/form/button';
import FormGroup from 'web/components/form/formgroup';
import MultiSelect from 'web/components/form/multiselect';
import Select from 'web/components/form/select';
import TextField from 'web/components/form/textfield';

import TrashIcon from 'web/components/icon/trashicon';

import Layout from 'web/components/layout/layout';

import Table from 'web/components/table/table';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHeader from 'web/components/table/header';
import TableHead from 'web/components/table/head';
import TableRow from 'web/components/table/row';

const Dialog = ({
  all_groups,
  all_permissions,
  all_users,
  error,
  group_id,
  permissions,
  permission_name,
  role,
  title = _('新建角色'),
  onClose,
  onCreatePermission,
  onCreateSuperPermission,
  onDeletePermission,
  onErrorClose,
  onSave,
}) => {
  const DEFAULTS = {name: _('未命名')};

  const is_edit = isDefined(role);
  const has_groups = isDefined(all_groups) && all_groups.length > 0;
  const has_permissions =
    isDefined(all_permissions) && all_permissions.length > 0;

  const groupOptions = map(all_groups, group => ({
    label: group.name,
    value: group.id,
  }));

  const permissionsOptions = map(all_permissions, permission => {
    const labelString =
      permission.name + ' (' + permissionDescription(permission.name) + ')';
    return {
      label: labelString,
      value: permission.name,
    };
  });

  const usersOptions = map(all_users, user => ({
    label: user.name,
    value: user.name,
  }));

  return (
    <SaveDialog
      error={error}
      title={title}
      onClose={onClose}
      onErrorClose={onErrorClose}
      onSave={onSave}
      defaultValues={{
        ...DEFAULTS,
        ...role,
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

            <FormGroup title={_('备注')} flex="column">
              <TextField
                name="comment"
                value={state.comment}
                size="30"
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('角色')}>
              <MultiSelect
                name="users"
                items={usersOptions}
                value={state.users}
                onChange={onValueChange}
              />
            </FormGroup>

            {is_edit && (
              <Layout flex="column">
                <h2>{_('新建权限')}</h2>

                <FormGroup
                  title={_('名称')}
                  align={['space-between', 'center']}
                >
                  <Select
                    name="permission_name"
                    items={permissionsOptions}
                    value={state.permission_name}
                    onChange={onValueChange}
                  />
                  <Button
                    title={_('创建权限')}
                    disabled={state.in_use || !has_permissions}
                    value={{role_id: state.id, name: state.permission_name}}
                    onClick={onCreatePermission}
                  />
                </FormGroup>

                <h2>{_('新增超级权限')}</h2>

                <FormGroup
                  title={_('组')}
                  align={['space-between', 'center']}
                >
                  <Select
                    name="group_id"
                    items={groupOptions}
                    value={state.group_id}
                    onChange={onValueChange}
                  />
                  <Button
                    title={_('创建权限')}
                    disabled={!has_groups}
                    value={{role_id: state.id, group_id: state.group_id}}
                    onClick={onCreateSuperPermission}
                  />
                </FormGroup>

                <h2>{_('常规命令权限')}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{_('名称')}</TableHead>
                      <TableHead>{_('说明')}</TableHead>
                      <TableHead width="2em">{_('操作')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {map(permissions, permission => {
                      return (
                        <TableRow key={permission.id}>
                          <TableData>{permission.name}</TableData>
                          <TableData>
                            {permissionDescription(
                              permission.name,
                              permission.resource,
                            )}
                          </TableData>
                          <TableData align={['center', 'center']}>
                            {!permission.isInUse() && (
                              <TrashIcon
                                title={_('将权限移动到收回站')}
                                value={{
                                  role_id: state.id,
                                  permission_id: permission.id,
                                }}
                                onClick={onDeletePermission}
                              />
                            )}
                          </TableData>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Layout>
            )}
          </Layout>
        );
      }}
    </SaveDialog>
  );
};

Dialog.propTypes = {
  all_groups: PropTypes.array,
  all_permissions: PropTypes.array,
  all_users: PropTypes.array,
  error: PropTypes.string,
  group_id: PropTypes.id,
  permission_name: PropTypes.string,
  permissions: PropTypes.array,
  role: PropTypes.model,
  title: PropTypes.string,
  users: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onCreatePermission: PropTypes.func.isRequired,
  onCreateSuperPermission: PropTypes.func.isRequired,
  onDeletePermission: PropTypes.func.isRequired,
  onErrorClose: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

export default Dialog;

// vim: set ts=2 sw=2 tw=80:
