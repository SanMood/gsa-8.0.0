/* Copyright (C) 2016-2019 Greenbone Networks GmbH
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

import Divider from '../components/layout/divider.js';
import IconDivider from '../components/layout/icondivider.js';
import Layout from '../components/layout/layout.js';

import PropTypes from '../utils/proptypes.js';
import SelectionType from '../utils/selectiontype.js';

import DeleteIcon from '../components/icon/deleteicon.js';
import ExportIcon from '../components/icon/exporticon.js';
import TagsIcon from '../components/icon/tagsicon.js';
import TrashIcon from '../components/icon/trashicon.js';

import Select from '../components/form/select.js';

import TableFooter from '../components/table/footer.js';
import TableRow from '../components/table/row.js';

export const EntitiesFooter = ({
  actions = true,
  children,
  download,
  selection = true,
  selectionType,
  span,
  tags = true,
  trash,
  onDeleteClick,
  onDownloadClick,
  onSelectionTypeChange,
  onTagsClick,
  onTrashClick,
  ...props
}) => {
  const deleteEntities = props.delete;
  const selectItems = [
    {
      value: SelectionType.SELECTION_PAGE_CONTENTS,
      label: _('应用于页面内容'),
    },
    {
      value: SelectionType.SELECTION_USER,
      label: _('应用于选定内容'),
    },
    {
      value: SelectionType.SELECTION_FILTER,
      label: _('应用于所有过滤'),
    },
  ];
  return (
    <TableFooter>
      <TableRow>
        <td colSpan={span}>
          {actions ? (
            <Layout align={['end', 'center']}>
              <Divider>
                {selection && (
                  <Select
                    items={selectItems}
                    value={selectionType}
                    onChange={onSelectionTypeChange}
                  />
                )}
                <IconDivider>
                  {tags && (
                    <TagsIcon
                      onClick={onTagsClick}
                      selectionType={selectionType}
                    />
                  )}
                  {trash && (
                    <TrashIcon
                      onClick={onTrashClick}
                      selectionType={selectionType}
                    />
                  )}
                  {deleteEntities && (
                    <DeleteIcon
                      onClick={onDeleteClick}
                      selectionType={selectionType}
                    />
                  )}
                  {download && (
                    <ExportIcon
                      onClick={onDownloadClick}
                      selectionType={selectionType}
                      value={download}
                    />
                  )}
                  {children}
                </IconDivider>
              </Divider>
            </Layout>
          ) : (
            children
          )}
        </td>
      </TableRow>
    </TableFooter>
  );
};

EntitiesFooter.propTypes = {
  actions: PropTypes.bool,
  delete: PropTypes.bool,
  download: PropTypes.stringOrFalse,
  selection: PropTypes.bool,
  selectionType: PropTypes.string,
  span: PropTypes.number.isRequired,
  tags: PropTypes.bool,
  trash: PropTypes.bool,
  onDeleteClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  onSelectionTypeChange: PropTypes.func,
  onTagsClick: PropTypes.func,
  onTrashClick: PropTypes.func,
};

export const withEntitiesFooter = (options = {}) => Component => {
  const EntitiesFooterWrapper = ({
    onDownloadBulk,
    onDeleteBulk,
    onTagsBulk,
    ...props
  }) => {
    return (
      <Component
        {...options}
        {...props}
        onDownloadClick={onDownloadBulk}
        onDeleteClick={onDeleteBulk}
        onTagsClick={onTagsBulk}
        onTrashClick={onDeleteBulk}
      />
    );
  };

  EntitiesFooterWrapper.propTypes = {
    onDeleteBulk: PropTypes.func,
    onDownloadBulk: PropTypes.func,
    onTagsBulk: PropTypes.func,
  };

  return EntitiesFooterWrapper;
};

export const createEntitiesFooter = options =>
  withEntitiesFooter(options)(EntitiesFooter);

export default EntitiesFooter;

// vim: set ts=2 sw=2 tw=80:
