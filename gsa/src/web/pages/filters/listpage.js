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

import {FILTERS_FILTER_FILTER} from 'gmp/models/filter';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import EntitiesPage from 'web/entities/page';
import withEntitiesContainer from 'web/entities/withEntitiesContainer';

import FilterIcon from 'web/components/icon/filtericon';
import ManualIcon from 'web/components/icon/manualicon';
import NewIcon from 'web/components/icon/newicon';

import IconDivider from 'web/components/layout/icondivider';

import {createFilterDialog} from 'web/components/powerfilter/dialog';

import {
  loadEntities,
  selector as entitiesSelector,
} from 'web/store/entities/filters';

import FilterComponent from './component';
import FiltersTable, {SORT_FIELDS} from './table';

const ToolBarIcons = withCapabilities(({capabilities, onFilterCreateClick}) => (
  <IconDivider>
    <ManualIcon page="search" searchTerm="filter" title={_('帮助：过滤器')} />
    {capabilities.mayCreate('filter') && (
      <NewIcon title={_('新建过滤器')} onClick={onFilterCreateClick} />
    )}
  </IconDivider>
));

ToolBarIcons.propTypes = {
  onFilterCreateClick: PropTypes.func.isRequired,
};

const FiltersFilterDialog = createFilterDialog({
  sortFields: SORT_FIELDS,
});

const FiltersPage = ({
  onChanged,
  onDownloaded,
  onError,
  onInteraction,
  ...props
}) => (
  <FilterComponent
    onCreated={onChanged}
    onSaved={onChanged}
    onCloned={onChanged}
    onCloneError={onError}
    onDeleted={onChanged}
    onDeleteError={onError}
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInteraction={onInteraction}
  >
    {({clone, create, delete: delete_func, download, edit, save}) => (
      <EntitiesPage
        {...props}
        filterEditDialog={FiltersFilterDialog}
        filtersFilter={FILTERS_FILTER_FILTER}
        sectionIcon={<FilterIcon size="large" />}
        table={FiltersTable}
        title={_('过滤器')}
        toolBarIcons={ToolBarIcons}
        onChanged={onChanged}
        onDownloaded={onDownloaded}
        onError={onError}
        onFilterCloneClick={clone}
        onFilterCreateClick={create}
        onFilterDeleteClick={delete_func}
        onFilterDownloadClick={download}
        onFilterEditClick={edit}
        onFilterSaveClick={save}
        onInteraction={onInteraction}
      />
    )}
  </FilterComponent>
);

FiltersPage.propTypes = {
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

export default withEntitiesContainer('filter', {
  entitiesSelector,
  loadEntities,
})(FiltersPage);

// vim: set ts=2 sw=2 tw=80:
