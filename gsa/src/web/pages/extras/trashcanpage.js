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

import {connect} from 'react-redux';

import styled from 'styled-components';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import ErrorBoundary from 'web/components/errorboundary/errorboundary';
import ErrorContainer from 'web/components/errorboundary/errorcontainer';

import Button from 'web/components/form/button';

import ManualIcon from 'web/components/icon/manualicon';
import TrashcanIcon from 'web/components/icon/trashcanicon';

import Layout from 'web/components/layout/layout';

import InnerLink from 'web/components/link/innerlink';
import LinkTarget from 'web/components/link/target';

import Loading from 'web/components/loading/loading';

import Section from 'web/components/section/section';

import Table from 'web/components/table/stripedtable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';

import {renewSessionTimeout} from 'web/store/usersettings/actions';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';
import withGmp from 'web/utils/withGmp';

import AlertsTable from '../alerts/table';
import AgentsTable from '../agents/table';
import ScanConfigsTable from '../scanconfigs/table';
import CredentialsTable from '../credentials/table';
import FiltersTable from '../filters/table';
import GroupsTable from '../groups/table';
import NotesTable from '../notes/table';
import OverridesTable from '../overrides/table';
import PermissionsTable from '../permissions/table';
import PortListsTable from '../portlists/table';
import ReportFormatsTable from '../reportformats/table';
import RolesTable from '../roles/table';
import ScannersTable from '../scanners/table';
import SchedulesTable from '../schedules/table';
import TagsTable from '../tags/table';
import TargetsTable from '../targets/table';
import TasksTable from '../tasks/table';
import TicketsTable from '../tickets/table';

import TrashActions from './trashactions';

const Col = styled.col`
  width: 50%;
`;

const ToolBarIcons = () => (
  <ManualIcon page="search" searchTerm="trashcan" title={_('帮助：回收站')} />
);

const EmptyTrashButton = withCapabilities(({onClick, capabilities}) => {
  if (!capabilities.mayOp('empty_trashcan')) {
    return null;
  }
  return (
    <Layout align="end">
      <Button onClick={onClick}>{_('清空回收站')}</Button>
    </Layout>
  );
});

class Trashcan extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      trash: undefined,
    };

    this.createContentRow = this.createContentRow.bind(this);
    this.createContentsTable = this.createContentsTable.bind(this);
    this.getTrash = this.getTrash.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
  }

  componentDidMount() {
    this.getTrash();
  }

  getTrash() {
    const {gmp} = this.props;
    const data = gmp.trashcan.get().then(
      response => {
        const trash = response.data;
        this.setState({trash});
      },
      error => {
        this.setState({error});
      },
    );
    return data;
  }

  handleInteraction() {
    const {onInteraction} = this.props;
    if (isDefined(onInteraction)) {
      onInteraction();
    }
  }

  handleRestore(entity) {
    const {gmp} = this.props;

    this.handleInteraction();

    gmp.trashcan.restore(entity).then(this.getTrash);
  }

  handleDelete(entity) {
    const {gmp} = this.props;

    this.handleInteraction();

    gmp.trashcan.delete(entity).then(this.getTrash);
  }

  handleEmpty() {
    const {gmp} = this.props;

    this.handleInteraction();

    gmp.trashcan.empty().then(this.getTrash);
  }

  createContentRow(type, title, count) {
    return (
      <TableRow key={type}>
        <TableData>
          <InnerLink to={type}>{_(title)}</InnerLink>
        </TableData>
        <TableData>{count}</TableData>
      </TableRow>
    );
  }

  createContentsTable(trash) {
    const render_agents = isDefined(trash.agent_list);
    const render_alerts = isDefined(trash.alert_list);
    const render_configs = isDefined(trash.config_list);
    const render_credentials = isDefined(trash.credential_list);
    const render_filters = isDefined(trash.filter_list);
    const render_groups = isDefined(trash.group_list);
    const render_notes = isDefined(trash.note_list);
    const render_overrides = isDefined(trash.override_list);
    const render_permissions = isDefined(trash.permission_list);
    const render_port_lists = isDefined(trash.port_list_list);
    const render_report_formats = isDefined(trash.report_format_list);
    const render_roles = isDefined(trash.role_list);
    const render_scanners = isDefined(trash.scanner_list);
    const render_schedules = isDefined(trash.schedule_list);
    const render_tags = isDefined(trash.tag_list);
    const render_targets = isDefined(trash.target_list);
    const render_tasks = isDefined(trash.task_list);
    const render_tickets = isDefined(trash.ticket_list);

    return (
      <TableBody>
        {render_agents &&
          this.createContentRow('agent', '代理', trash.agent_list.length)}
        {render_alerts &&
          this.createContentRow('alert', '警报', trash.alert_list.length)}
        {render_configs &&
          this.createContentRow('config', '配置', trash.config_list.length)}
        {render_credentials &&
          this.createContentRow(
            'credential',
            'Credentials',
            trash.credential_list.length,
          )}
        {render_filters &&
          this.createContentRow('filter', '过滤器', trash.filter_list.length)}
        {render_groups &&
          this.createContentRow('group', '组', trash.group_list.length)}
        {render_notes &&
          this.createContentRow('note', '注释', trash.note_list.length)}
        {render_overrides &&
          this.createContentRow(
            'override',
            '复写',
            trash.override_list.length,
          )}
        {render_permissions &&
          this.createContentRow(
            'permission',
            '权限',
            trash.permission_list.length,
          )}
        {render_port_lists &&
          this.createContentRow(
            'port_list',
            'Port列表',
            trash.port_list_list.length,
          )}
        {render_report_formats &&
          this.createContentRow(
            'report_format',
            '报告格式',
            trash.report_format_list.length,
          )}
        {render_roles &&
          this.createContentRow('role', '角色', trash.role_list.length)}
        {render_scanners &&
          this.createContentRow(
            'scanner',
            '扫描仪',
            trash.scanner_list.length,
          )}
        {render_schedules &&
          this.createContentRow(
            'schedule',
            '计划',
            trash.schedule_list.length,
          )}
        {render_tags &&
          this.createContentRow('tag', '标签', trash.tag_list.length)}
        {render_targets &&
          this.createContentRow('target', '目标', trash.target_list.length)}
        {render_tasks &&
          this.createContentRow('task', '任务', trash.task_list.length)}
        {render_tickets &&
          this.createContentRow('ticket', '票据', trash.ticket_list.length)}
      </TableBody>
    );
  }

  render() {
    const {error, trash} = this.state;

    if (isDefined(error)) {
      return <ErrorContainer>{error.message}</ErrorContainer>;
    }
    if (!isDefined(trash)) {
      return <Loading />;
    }

    const contents_table = this.createContentsTable(trash);

    const table_props = {
      links: false,
      onEntityRestore: this.handleRestore,
      onEntityDelete: this.handleDelete,
      actionsComponent: TrashActions,
      footnote: false,
      footer: false,
    };

    return (
      <ErrorBoundary errElement={_('page')}>
        <Layout flex="column">
          <ToolBarIcons />
          <Section img={<TrashcanIcon size="large" />} title={_('回收站')} />
          <EmptyTrashButton onClick={this.handleEmpty} />

          <LinkTarget id="Contents" />
          <h1>{_('内容')}</h1>
          <Table>
            <colgroup>
              <Col />
              <Col />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>{_('类型')}</TableHead>
                <TableHead>{_('项目')}</TableHead>
              </TableRow>
            </TableHeader>
            {contents_table}
          </Table>

          {isDefined(trash.agent_list) && (
            <span>
              <LinkTarget id="agent" />
              <h1>{_('代理')}</h1>
              <AgentsTable entities={trash.agent_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.alert_list) && (
            <span>
              <LinkTarget id="alert" />
              <h1>{_('警报')}</h1>
              <AlertsTable entities={trash.alert_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.config_list) && (
            <span>
              <LinkTarget id="config" />
              <h1>{_('扫描配置')}</h1>
              <ScanConfigsTable entities={trash.config_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.credential_list) && (
            <span>
              <LinkTarget id="credential" />
              <h1>{_('证书')}</h1>
              <CredentialsTable
                entities={trash.credential_list}
                {...table_props}
              />
            </span>
          )}
          {isDefined(trash.filter_list) && (
            <span>
              <LinkTarget id="filter" />
              <h1>{_('过滤器')}</h1>
              <FiltersTable entities={trash.filter_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.group_list) && (
            <span>
              <LinkTarget id="group" />
              <h1>{_('组')}</h1>
              <GroupsTable entities={trash.group_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.note_list) && (
            <span>
              <LinkTarget id="note" />
              <h1>{_('注释')}</h1>
              <NotesTable entities={trash.note_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.override_list) && (
            <span>
              <LinkTarget id="override" />
              <h1>{_('复写')}</h1>
              <OverridesTable entities={trash.override_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.permission_list) && (
            <span>
              <LinkTarget id="permission" />
              <h1>{_('权限')}</h1>
              <PermissionsTable
                entities={trash.permission_list}
                {...table_props}
              />
            </span>
          )}
          {isDefined(trash.port_list_list) && (
            <span>
              <LinkTarget id="port_list" />
              <h1>{_('Port列表')}</h1>
              <PortListsTable
                entities={trash.port_list_list}
                {...table_props}
              />
            </span>
          )}
          {isDefined(trash.report_format_list) && (
            <span>
              <LinkTarget id="report_format" />
              <h1>{_('报告格式')}</h1>
              <ReportFormatsTable
                entities={trash.report_format_list}
                {...table_props}
              />
            </span>
          )}
          {isDefined(trash.role_list) && (
            <span>
              <LinkTarget id="role" />
              <h1>{_('角色')}</h1>
              <RolesTable entities={trash.role_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.scanner_list) && (
            <span>
              <LinkTarget id="scanner" />
              <h1>{_('扫描仪')}</h1>
              <ScannersTable entities={trash.scanner_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.schedule_list) && (
            <span>
              <LinkTarget id="schedule" />
              <h1>{_('计划')}</h1>
              <SchedulesTable entities={trash.schedule_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.tag_list) && (
            <span>
              <LinkTarget id="tag" />
              <h1>{_('标签')}</h1>
              <TagsTable entities={trash.tag_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.target_list) && (
            <span>
              <LinkTarget id="target" />
              <h1>{_('目标')}</h1>
              <TargetsTable entities={trash.target_list} {...table_props} />
            </span>
          )}
          {isDefined(trash.task_list) && (
            <span>
              <LinkTarget id="task" />
              <h1>{_('任务')}</h1>
              <TasksTable entities={trash.task_list} {...table_props} />
            </span>
          )}

          {isDefined(trash.ticket_list) && (
            <span>
              <LinkTarget id="ticket" />
              <h1>{_('票据')}</h1>
              <TicketsTable entities={trash.ticket_list} {...table_props} />
            </span>
          )}
        </Layout>
      </ErrorBoundary>
    );
  }
}

Trashcan.propTypes = {
  gmp: PropTypes.gmp.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  onInteraction: () => dispatch(renewSessionTimeout(gmp)()),
});

export default compose(
  withGmp,
  connect(
    undefined,
    mapDispatchToProps,
  ),
)(Trashcan);

// vim: set ts=2 sw=2 tw=80:
