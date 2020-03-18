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

import Filter, {REPORTS_FILTER_FILTER} from 'gmp/models/filter';

import {isActive} from 'gmp/models/task';

import {isDefined} from 'gmp/utils/identity';
import {selectSaveId} from 'gmp/utils/id';

import EntitiesPage from 'web/entities/page';
import withEntitiesContainer from 'web/entities/withEntitiesContainer';

import DashboardControls from 'web/components/dashboard/controls';

import ManualIcon from 'web/components/icon/manualicon';
import UploadIcon from 'web/components/icon/uploadicon';
import ReportIcon from 'web/components/icon/reporticon';

import IconDivider from 'web/components/layout/icondivider';

import ContainerTaskDialog from 'web/pages/tasks/containerdialog';

import {
  loadEntities,
  selector as entitiesSelector,
} from 'web/store/entities/reports';

import {DEFAULT_RELOAD_INTERVAL_ACTIVE} from 'web/utils/constants';
import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';

import ReportFilterDialog from './filterdialog';
import ImportReportDialog from './importdialog';
import ReportsTable from './table';

import ReportsDashboard, {REPORTS_DASHBOARD_ID} from './dashboard';

const ToolBarIcons = ({onUploadReportClick}) => (
  <IconDivider>
    <ManualIcon
      page="vulnerabilitymanagement"
      anchor="reading-of-the-reports"
      title={_('帮助：报告')}
    />
    <UploadIcon title={_('上传报告')} onClick={onUploadReportClick} />
  </IconDivider>
);

ToolBarIcons.propTypes = {
  onUploadReportClick: PropTypes.func,
};

class Page extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      importDialogVisible: false,
      containerTaskDialogVisible: false,
    };

    this.handleImportReport = this.handleImportReport.bind(this);
    this.handleCreateContainerTask = this.handleCreateContainerTask.bind(this);
    this.handleCloseContainerTask = this.handleCloseContainerTask.bind(this);
    this.handleReportDeltaSelect = this.handleReportDeltaSelect.bind(this);
    this.handleReportDeleteClick = this.handleReportDeleteClick.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);

    this.openImportDialog = this.openImportDialog.bind(this);
    this.handleCloseImportDialog = this.handleCloseImportDialog.bind(this);
    this.openCreateTaskDialog = this.openCreateTaskDialog.bind(this);
    this.loadTasks = this.loadTasks.bind(this);
  }

  componentWillReceiveProps(next) {
    const {filter} = next;
    const {selectedDeltaReport} = this.state;

    if (
      isDefined(selectedDeltaReport) &&
      (!isDefined(filter) ||
        filter.get('task_id') !== selectedDeltaReport.task.id)
    ) {
      // filter has changed. reset delta report selection
      this.setState({selectedDeltaReport: undefined});
    }
  }

  loadTasks() {
    const {gmp} = this.props;
    return gmp.tasks.get().then(response => {
      const {data: tasks} = response;
      return tasks.filter(task => task.isContainer());
    });
  }

  openCreateTaskDialog() {
    this.setState({containerTaskDialogVisible: true});
  }

  openImportDialog(task_id) {
    this.loadTasks().then(tasks =>
      this.setState({
        tasks,
        task_id: selectSaveId(tasks),
        importDialogVisible: true,
      }),
    );
  }

  closeImportDialog() {
    this.setState({importDialogVisible: false});
  }

  handleCloseImportDialog() {
    this.closeImportDialog();
  }

  handleImportReport(data) {
    const {gmp, onChanged, onError} = this.props;
    return gmp.report
      .import(data)
      .then(onChanged, onError)
      .then(() => this.closeImportDialog());
  }

  closeContainerTaskDialog() {
    this.setState({containerTaskDialogVisible: false});
  }

  handleCreateContainerTask(data) {
    const {gmp} = this.props;
    let task_id;
    return gmp.task
      .createContainer(data)
      .then(response => {
        const {data: task} = response;
        task_id = task.id;
      })
      .then(this.loadTasks)
      .then(tasks => this.setState({tasks, task_id}))
      .then(() => this.closeContainerTaskDialog());
  }

  handleCloseContainerTask() {
    this.closeContainerTaskDialog();
  }

  handleReportDeltaSelect(report) {
    const {onFilterChanged} = this.props;
    const {selectedDeltaReport, beforeSelectFilter} = this.state;

    if (isDefined(selectedDeltaReport)) {
      const {history} = this.props;

      onFilterChanged(beforeSelectFilter);

      history.push('/report/delta/' + selectedDeltaReport.id + '/' + report.id);
    } else {
      const {filter = new Filter()} = this.props;

      onFilterChanged(filter.copy().set('task_id', report.task.id));

      this.setState({
        beforeSelectFilter: filter,
        selectedDeltaReport: report,
      });
    }
  }

  handleReportDeleteClick(report) {
    const {gmp, onChanged, onError} = this.props;
    return gmp.report.delete(report).then(onChanged, onError);
  }

  handleTaskChange(task_id) {
    this.setState({task_id});
  }

  render() {
    const {filter, onFilterChanged, onInteraction} = this.props;
    const {
      containerTaskDialogVisible,
      importDialogVisible,
      task_id,
      tasks,
    } = this.state;

    return (
      <React.Fragment>
        <EntitiesPage
          {...this.props}
          {...this.state}
          dashboard={() => (
            <ReportsDashboard
              filter={filter}
              onFilterChanged={onFilterChanged}
              onInteraction={onInteraction}
            />
          )}
          dashboardControls={() => (
            <DashboardControls
              dashboardId={REPORTS_DASHBOARD_ID}
              onInteraction={onInteraction}
            />
          )}
          filtersFilter={REPORTS_FILTER_FILTER}
          filterEditDialog={ReportFilterDialog}
          table={ReportsTable}
          toolBarIcons={ToolBarIcons}
          title={_('报告')}
          sectionIcon={<ReportIcon size="large" />}
          onInteraction={onInteraction}
          onUploadReportClick={this.openImportDialog}
          onReportDeltaSelect={this.handleReportDeltaSelect}
          onReportDeleteClick={this.handleReportDeleteClick}
        />
        {importDialogVisible && (
          <ImportReportDialog
            task_id={task_id}
            tasks={tasks}
            onNewContainerTaskClick={this.openCreateTaskDialog}
            onClose={this.handleCloseImportDialog}
            onSave={this.handleImportReport}
            onTaskChange={this.handleTaskChange}
          />
        )}
        {containerTaskDialogVisible && (
          <ContainerTaskDialog
            onClose={this.handleCloseContainerTask}
            onSave={this.handleCreateContainerTask}
          />
        )}
      </React.Fragment>
    );
  }
}

Page.propTypes = {
  filter: PropTypes.filter,
  gmp: PropTypes.gmp.isRequired,
  history: PropTypes.object.isRequired,
  onChanged: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
};

const reportsReloadInterval = ({entities = [], defaultReloadInterval}) =>
  entities.some(entity => isActive(entity.report.scan_run_status))
    ? DEFAULT_RELOAD_INTERVAL_ACTIVE
    : defaultReloadInterval;

export default compose(
  withGmp,
  withEntitiesContainer('report', {
    entitiesSelector,
    loadEntities,
    reloadInterval: reportsReloadInterval,
  }),
)(Page);

// vim: set ts=2 sw=2 tw=80:
