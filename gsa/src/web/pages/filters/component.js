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

import {_, _l} from 'gmp/locale/lang';

import {isDefined} from 'gmp/utils/identity';
import {first} from 'gmp/utils/array';
import {shorten} from 'gmp/utils/string';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import EntityComponent from 'web/entity/component';

import FilterDialog from 'web/pages/filters/dialog';

const FILTER_OPTIONS = [
  ['agent', _l('代理')],
  ['alert', _l('警报')],
  ['credential', _l('证书')],
  ['filter', _l('过滤器')],
  ['group', _l('组')],
  ['host', _l('主机')],
  ['note', _l('注释')],
  ['os', _l('操作系统')],
  ['override', _l('复写')],
  ['permission', _l('权限')],
  ['port_list', _l('端口列表')],
  ['report', _l('报告')],
  ['report_format', _l('报告格式')],
  ['result', _l('结果')],
  ['role', _l('角色')],
  ['schedule', _l('计划')],
  ['info', _l('安全信息')],
  ['config', _l('扫描配置')],
  ['tag', _l('标签')],
  ['target', _l('目标')],
  ['task', _l('任务')],
  ['user', _l('用户')],
];

const filter_types = (caps, name) => {
  return caps.mayAccess(name);
};

const includes_type = (types, type) => {
  for (const option of types) {
    if (option[0] === type) {
      return true;
    }
  }
  return false;
};

class FilterComponent extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      dialogVisible: false,
      types: [],
    };

    this.handleCloseFilterDialog = this.handleCloseFilterDialog.bind(this);
    this.openFilterDialog = this.openFilterDialog.bind(this);
  }

  openFilterDialog(filter) {
    const {capabilities} = this.props;

    let types = FILTER_OPTIONS.filter(option =>
      filter_types(capabilities, option[0]),
    );

    if (!isDefined(types)) {
      types = [];
    }

    this.handleInteraction();

    if (isDefined(filter)) {
      let {filter_type} = filter;
      if (!includes_type(types, filter_type)) {
        filter_type = first(types, [])[0];
      }

      const title = _('编辑过滤器{{name}}', {name: shorten(filter.name)});

      this.setState({
        comment: filter.comment,
        dialogVisible: true,
        id: filter.id,
        name: filter.name,
        term: filter.toFilterString(),
        title,
        type: filter_type,
        types,
      });
    } else {
      const type = first(types, [])[0]; // eslint-disable-line prefer-destructuring

      this.setState({
        comment: undefined,
        dialogVisible: true,
        id: undefined,
        name: undefined,
        term: '',
        type,
        types,
      });
    }
  }

  closeFilterDialog() {
    this.setState({dialogVisible: false});
  }

  handleCloseFilterDialog() {
    this.closeFilterDialog();
    this.handleInteraction();
  }

  handleInteraction() {
    const {onInteraction} = this.props;
    if (isDefined(onInteraction)) {
      onInteraction();
    }
  }

  render() {
    const {
      children,
      onCloned,
      onCloneError,
      onCreated,
      onCreateError,
      onDeleted,
      onDeleteError,
      onDownloaded,
      onDownloadError,
      onInteraction,
      onSaved,
      onSaveError,
    } = this.props;

    const {
      comment,
      dialogVisible,
      id,
      name,
      term,
      title,
      type,
      types,
    } = this.state;

    return (
      <EntityComponent
        name="filter"
        onCreated={onCreated}
        onCreateError={onCreateError}
        onCloned={onCloned}
        onCloneError={onCloneError}
        onDeleted={onDeleted}
        onDeleteError={onDeleteError}
        onDownloaded={onDownloaded}
        onDownloadError={onDownloadError}
        onInteraction={onInteraction}
        onSaved={onSaved}
        onSaveError={onSaveError}
      >
        {({save, ...other}) => (
          <React.Fragment>
            {children({
              ...other,
              create: this.openFilterDialog,
              edit: this.openFilterDialog,
            })}
            {dialogVisible && (
              <FilterDialog
                comment={comment}
                id={id}
                name={name}
                term={term}
                title={title}
                type={type}
                types={types}
                onClose={this.handleCloseFilterDialog}
                onSave={d => {
                  this.handleInteraction();
                  return save(d).then(() => this.closeFilterDialog());
                }}
              />
            )}
          </React.Fragment>
        )}
      </EntityComponent>
    );
  }
}

FilterComponent.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  children: PropTypes.func.isRequired,
  onCloneError: PropTypes.func,
  onCloned: PropTypes.func,
  onCreateError: PropTypes.func,
  onCreated: PropTypes.func,
  onDeleteError: PropTypes.func,
  onDeleted: PropTypes.func,
  onDownloadError: PropTypes.func,
  onDownloaded: PropTypes.func,
  onInteraction: PropTypes.func.isRequired,
  onSaveError: PropTypes.func,
  onSaved: PropTypes.func,
};

export default withCapabilities(FilterComponent);
