/* Copyright (C) 2018 - 2019 Greenbone Networks GmbH
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

import {NO_VALUE, YES_VALUE} from 'gmp/parser';

import {isDefined} from 'gmp/utils/identity';
import PropTypes from 'web/utils/proptypes';
import {renderSelectItems, UNSET_VALUE} from 'web/utils/render';

import ComposerContent, {
  COMPOSER_CONTENT_DEFAULTS,
} from 'web/components/dialog/composercontent'; /* eslint-disable-line max-len*/

import SaveDialog from 'web/components/dialog/savedialog';

import CheckBox from 'web/components/form/checkbox';
import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';

import Layout from 'web/components/layout/layout';

const StyledDiv = styled.div`
  text-align: end;
`;

const ContentComposerDialog = ({
  filterId,
  filters,
  filterString = '',
  includeNotes = COMPOSER_CONTENT_DEFAULTS.includeNotes,
  includeOverrides = COMPOSER_CONTENT_DEFAULTS.includeOverrides,
  storeAsDefault,
  onClose,
  onFilterIdChange,
  onSave,
  onChange,
}) => {
  filterId =
    filterId === NO_VALUE || !isDefined(filterId) ? UNSET_VALUE : filterId;

  const controlledValues = {
    filterId,
    filterString,
    includeNotes,
    includeOverrides,
    storeAsDefault,
  };

  return (
    <SaveDialog
      buttonTitle={_('OK')}
      title={_('撰写扫描报告的内容')}
      values={controlledValues}
      onClose={onClose}
      onSave={onSave}
    >
      {({values, onValueChange}) => (
        <Layout flex="column">
          <FormGroup title={_('报表结果过滤器')} titleSize="3">
            <Select
              name="filterId"
              value={values.filterId}
              items={renderSelectItems(filters, UNSET_VALUE)}
              onChange={onFilterIdChange}
            />
          </FormGroup>
          <ComposerContent
            filterFieldTitle={_(
              '若要更改过滤器，请从下拉菜单中选择过滤器。',
            )}
            filterString={values.filterString}
            includeNotes={values.includeNotes}
            includeOverrides={values.includeOverrides}
            onValueChange={onChange}
          />
          <StyledDiv>
            <CheckBox
              name="storeAsDefault"
              checked={values.storeAsDefault}
              checkedValue={YES_VALUE}
              unCheckedValue={NO_VALUE}
              title={_('存储为默认值')}
              onChange={onChange}
            />
          </StyledDiv>
        </Layout>
      )}
    </SaveDialog>
  );
};

ContentComposerDialog.propTypes = {
  defaultReportFormatId: PropTypes.id,
  filterId: PropTypes.toString,
  filterString: PropTypes.string,
  filters: PropTypes.array,
  includeNotes: PropTypes.number,
  includeOverrides: PropTypes.number,
  reportFormatId: PropTypes.id,
  reportFormats: PropTypes.array,
  storeAsDefault: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterIdChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ContentComposerDialog;

// vim: set ts=2 sw=2 tw=80:
