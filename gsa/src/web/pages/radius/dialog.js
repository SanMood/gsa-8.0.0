
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

import _ from 'gmp/locale';

import {YES_VALUE, NO_VALUE} from 'gmp/parser';

import PropTypes from 'web/utils/proptypes';

import SaveDialog from 'web/components/dialog/savedialog';

import CheckBox from 'web/components/form/checkbox';
import FormGroup from 'web/components/form/formgroup';
import PasswordField from 'web/components/form/passwordfield';
import TextField from 'web/components/form/textfield';

import Layout from 'web/components/layout/layout';

const RadiusDialog = ({enable, radiushost, radiuskey, onClose, onSave}) => {
  const uncontrolledValues = {
    enable,
    radiushost,
    radiuskey,
  };

  return (
    <SaveDialog
      buttonTitle={_('好')}
      title={_('编辑身份验证')}
      defaultValues={uncontrolledValues}
      onClose={onClose}
      onSave={onSave}
    >
      {({values, onValueChange}) => (
        <Layout flex="column">
          <FormGroup title={_('启用')}>
            <CheckBox
              data-testid="enable-checkbox"
              name="enable"
              checked={values.enable === YES_VALUE}
              checkedValue={YES_VALUE}
              unCheckedValue={NO_VALUE}
              onChange={onValueChange}
            />
          </FormGroup>
          <FormGroup title={_('RADIUS主机')}>
            <TextField
              data-testid="radiushost-textfield"
              name="radiushost"
              value={values.radiushost}
              onChange={onValueChange}
            />
          </FormGroup>
          <FormGroup title={_('密钥')}>
            <PasswordField
              data-testid="radiuskey-textfield"
              name="radiuskey"
              value={radiuskey}
              size="30"
              onChange={onValueChange}
            />
          </FormGroup>
        </Layout>
      )}
    </SaveDialog>
  );
};

RadiusDialog.propTypes = {
  enable: PropTypes.number.isRequired,
  radiushost: PropTypes.string.isRequired,
  radiuskey: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default RadiusDialog;

// vim: set ts=2 sw=2 tw=80:
