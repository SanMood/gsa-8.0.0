/* Copyright (C) 2018-2019 Greenbone Networks GmbH
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

import 'core-js/fn/object/entries';

import React from 'react';
import {connect} from 'react-redux';

import _ from 'gmp/locale';

import {ALL_FILTER} from 'gmp/models/filter';
import {
  filterEmptyScanConfig,
  openVasScanConfigsFilter,
  ospScanConfigsFilter,
} from 'gmp/models/scanconfig';
import {openVasScannersFilter, ospScannersFilter} from 'gmp/models/scanner';

import {YES_VALUE, parseYesNo} from 'gmp/parser';

import {isDefined} from 'gmp/utils/identity';

import ErrorBoundary from 'web/components/errorboundary/errorboundary';

import ManualIcon from 'web/components/icon/manualicon';
import MySettingsIcon from 'web/components/icon/mysettingsicon';
import EditIcon from 'web/components/icon/editicon';

import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import Loading from 'web/components/loading/loading';

import Section from 'web/components/section/section';

import Tab from 'web/components/tab/tab';
import TabLayout from 'web/components/tab/tablayout';
import TabList from 'web/components/tab/tablist';
import TabPanel from 'web/components/tab/tabpanel';
import TabPanels from 'web/components/tab/tabpanels';
import Tabs from 'web/components/tab/tabs';

import {
  loadEntities as loadAlerts,
  loadEntity as loadAlert,
  selector as alertsSelector,
} from 'web/store/entities/alerts';
import {
  loadEntities as loadCredentials,
  selector as credentialsSelector,
} from 'web/store/entities/credentials';
import {
  loadEntities as loadFilters,
  selector as filtersSelector,
} from 'web/store/entities/filters';
import {
  loadEntities as loadPortLists,
  selector as portListsSelector,
} from 'web/store/entities/portlists';
import {
  loadEntities as loadReportFormats,
  selector as reportFormatsSelector,
} from 'web/store/entities/reportformats';
import {
  loadEntities as loadScanConfigs,
  selector as scanConfigsSelector,
} from 'web/store/entities/scanconfigs';
import {
  loadEntities as loadScanners,
  selector as scannersSelector,
} from 'web/store/entities/scanners';
import {
  loadEntities as loadSchedules,
  selector as schedulesSelector,
} from 'web/store/entities/schedules';
import {
  loadEntities as loadTargets,
  selector as targetsSelector,
} from 'web/store/entities/targets';

import {loadUserSettingDefaults} from 'web/store/usersettings/defaults/actions';
import {getUserSettingsDefaults} from 'web/store/usersettings/defaults/selectors';

import {getTimezone} from 'web/store/usersettings/selectors';
import {
  updateTimezone,
  renewSessionTimeout,
} from 'web/store/usersettings/actions';

import Table from 'web/components/table/table';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

import compose from 'web/utils/compose';
import Languages, {BROWSER_LANGUAGE} from 'web/utils/languages';
import PropTypes from 'web/utils/proptypes';
import {
  SEVERITY_CLASS_NIST,
  SEVERITY_CLASS_BSI,
  SEVERITY_CLASS_PCI_DSS,
} from 'web/utils/severity';
import withCapabilities from 'web/utils/withCapabilities';
import withGmp from 'web/utils/withGmp';

import SettingsDialog from './dialog';

const FIRST_COL_WIDTH = '250px';
export const SEVERITY_CLASSES = [
  {id: SEVERITY_CLASS_NIST, name: 'NVD Vulnerability Severity Ratings'},
  {id: SEVERITY_CLASS_BSI, name: 'BSI Schwachstellenampel (Germany)'},
  {id: SEVERITY_CLASS_PCI_DSS, name: 'PCI-DSS'},
];

const getLangNameByCode = code => {
  const language = Languages[code];
  return isDefined(language) ? `${language.name}` : null;
};

const SettingTableRow = ({setting, title, type}) => {
  const {comment, id, name} = setting;
  return (
    <TableRow title={comment}>
      <TableData>{title}</TableData>
      <TableData>
        <Layout>
          {isDefined(id) && (
            <DetailsLink id={id} type={type}>
              {name}
            </DetailsLink>
          )}
        </Layout>
      </TableData>
    </TableRow>
  );
};

SettingTableRow.propTypes = {
  setting: PropTypes.object,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const ToolBarIcons = ({onEditSettingsClick}) => (
  <Layout>
    <IconDivider>
      <ManualIcon
        size="small"
        page="gui_introduction"
        anchor="my-settings"
        title={_('帮助：我的设置')}
      />
      <EditIcon
        size="small"
        title={_('编辑我的设置')}
        onClick={onEditSettingsClick}
      />
    </IconDivider>
  </Layout>
);

ToolBarIcons.propTypes = {
  onEditSettingsClick: PropTypes.func.isRequired,
};

class UserSettings extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activeTab: 0,
      dialogVisible: false,
    };

    this.openDialog = this.openDialog.bind(this);
    this.handleActivateTab = this.handleActivateTab.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleSaveSettings = this.handleSaveSettings.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  componentDidMount() {
    this.props.loadSettings();
    this.loadEntities();
  }

  handleActivateTab(index) {
    this.handleInteraction();

    this.setState({activeTab: index});
  }

  loadEntities() {
    this.props.loadAlerts();
    this.props.loadCredentials();
    this.props.loadFilters();
    this.props.loadPortLists();
    this.props.loadReportFormats();
    this.props.loadScanConfigs();
    this.props.loadScanners();
    this.props.loadSchedules();
    this.props.loadTargets();
  }

  openDialog() {
    this.setState({dialogVisible: true});
    this.handleInteraction();
  }

  closeDialog() {
    this.setState({dialogVisible: false});
  }

  handleCloseDialog() {
    this.closeDialog();
    this.handleInteraction();
  }

  handleInteraction() {
    const {onInteraction} = this.props;
    if (isDefined(onInteraction)) {
      onInteraction();
    }
  }

  getSeverityClassNameById(id) {
    const specifiedClass = SEVERITY_CLASSES.find(clas => {
      return clas.id === id;
    });
    return isDefined(specifiedClass) ? specifiedClass.name : undefined;
  }

  handleSaveSettings(data) {
    const {gmp} = this.props;
    const {userInterfaceLanguage = BROWSER_LANGUAGE, timezone} = data;

    this.handleInteraction();

    return gmp.user.saveSettings(data).then(() => {
      this.closeDialog();
      this.props.setLocale(
        userInterfaceLanguage === BROWSER_LANGUAGE
          ? undefined
          : userInterfaceLanguage,
      );
      this.props.setTimezone(timezone);

      this.props.loadSettings();
    });
  }

  handleValueChange(value, name) {
    this.setState({[name]: value});
  }

  render() {
    const {activeTab, dialogVisible} = this.state;

    const {
      capabilities,
      filters,
      alerts,
      credentials,
      scanconfigs = [],
      scanners = [],
      portlists,
      reportformats,
      schedules,
      targets,
      isLoading = true,
      timezone,
      userInterfaceLanguage = {},
      rowsPerPage = {},
      maxRowsPerPage = {},
      detailsExportFileName = {},
      listExportFileName = {},
      reportExportFileName = {},
      severityClass = {},
      dynamicSeverity = {},
      defaultSeverity = {},
      defaultAlert = {},
      defaultEsxiCredential = {},
      defaultOspScanConfig = {},
      defaultOspScanner = {},
      defaultOpenvasScanConfig = {},
      defaultOpenvasScanner = {},
      defaultPortList = {},
      defaultReportFormat = {},
      defaultSmbCredential = {},
      defaultSnmpCredential = {},
      defaultSshCredential = {},
      defaultSchedule = {},
      defaultTarget = {},
      agentsFilter = {},
      alertsFilter = {},
      configsFilter = {},
      credentialsFilter = {},
      filtersFilter = {},
      hostsFilter = {},
      notesFilter = {},
      operatingSystemsFilter = {},
      overridesFilter = {},
      permissionsFilter = {},
      portListsFilter = {},
      reportsFilter = {},
      reportFormatsFilter = {},
      resultsFilter = {},
      rolesFilter = {},
      schedulesFilter = {},
      tagsFilter = {},
      targetsFilter = {},
      tasksFilter = {},
      cpeFilter = {},
      cveFilter = {},
      nvtFilter = {},
      ovalFilter = {},
      certBundFilter = {},
      dfnCertFilter = {},
      secInfoFilter = {},
      autoCacheRebuild = {},
    } = this.props;

    const openVasScanConfigs = scanconfigs.filter(openVasScanConfigsFilter);
    const ospScanConfigs = scanconfigs.filter(ospScanConfigsFilter);
    const openVasScanners = scanners.filter(openVasScannersFilter);
    const ospScanners = scanners.filter(ospScannersFilter);

    return (
      <ErrorBoundary errElement={_('page')}>
        <Layout flex="column">
          <ToolBarIcons onEditSettingsClick={this.openDialog} />
          <Section
            img={<MySettingsIcon size="large" />}
            title={_('我的设置')}
          />
          {isLoading ? (
            <Loading />
          ) : (
            <React.Fragment>
              <TabLayout grow="1" align={['start', 'end']}>
                <TabList
                  active={activeTab}
                  align={['start', 'stretch']}
                  onActivateTab={this.handleActivateTab}
                >
                  <Tab>{_('概述')}</Tab>
                  <Tab>{_('严重程度')}</Tab>
                  <Tab>{_('默认值')}</Tab>
                  {capabilities.mayAccess('filter') && (
                    <Tab>{_('过滤器')}</Tab>
                  )}
                </TabList>
              </TabLayout>

              <Tabs active={activeTab}>
                <TabPanels>
                  <TabPanel>
                    <Table>
                      <colgroup width={FIRST_COL_WIDTH} />
                      <TableBody>
                        <TableRow>
                          <TableData>{_('时区')}</TableData>
                          <TableData>{timezone}</TableData>
                        </TableRow>
                        <TableRow>
                          <TableData>{_('密码')}</TableData>
                          <TableData>********</TableData>
                        </TableRow>
                        <TableRow title={userInterfaceLanguage.comment}>
                          <TableData>{_('用户界面语言')}</TableData>
                          <TableData>
                            {getLangNameByCode(userInterfaceLanguage.value)}
                          </TableData>
                        </TableRow>
                        <TableRow title={rowsPerPage.comment}>
                          <TableData>{_('每页行数')}</TableData>
                          <TableData>{rowsPerPage.value}</TableData>
                        </TableRow>
                        <TableRow title={detailsExportFileName.comment}>
                          <TableData>{_('以详细信息导出文件名')}</TableData>
                          <TableData>{detailsExportFileName.value}</TableData>
                        </TableRow>
                        <TableRow title={listExportFileName.comment}>
                          <TableData>{_('以列表导出文件名')}</TableData>
                          <TableData>{listExportFileName.value}</TableData>
                        </TableRow>
                        <TableRow title={reportExportFileName.comment}>
                          <TableData>{_('以报告导出文件名')}</TableData>
                          <TableData>{reportExportFileName.value}</TableData>
                        </TableRow>
                        <TableRow title={maxRowsPerPage.comment}>
                          <TableData>
                            {_('每页最大行数（不可变）')}
                          </TableData>
                          <TableData>{maxRowsPerPage.value}</TableData>
                        </TableRow>
                        <TableRow title={autoCacheRebuild.comment}>
                          <TableData>{_('自动重建缓存')}</TableData>
                          <TableData>
                            {isDefined(autoCacheRebuild.value)
                              ? parseYesNo(autoCacheRebuild.value) === YES_VALUE
                                ? _('是')
                                : _('否')
                              : ''}
                          </TableData>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabPanel>
                  <TabPanel>
                    <Table>
                      <colgroup width={FIRST_COL_WIDTH} />
                      <TableBody>
                        <TableRow title={severityClass.comment}>
                          <TableData>{_('严重程度类型')}</TableData>
                          <TableData>
                            {this.getSeverityClassNameById(severityClass.value)}
                          </TableData>
                        </TableRow>
                        <TableRow title={dynamicSeverity.comment}>
                          <TableData>{_('动态严重性')}</TableData>
                          <TableData>
                            {isDefined(dynamicSeverity.value)
                              ? parseYesNo(dynamicSeverity.value) === YES_VALUE
                                ? _('是')
                                : _('否')
                              : ''}
                          </TableData>
                        </TableRow>
                        <TableRow title={defaultSeverity.comment}>
                          <TableData>{_('默认严重程度')}</TableData>
                          <TableData>{defaultSeverity.value}</TableData>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabPanel>

                  <TabPanel>
                    <Table>
                      <colgroup width={FIRST_COL_WIDTH} />
                      <TableBody>
                        {capabilities.mayAccess('alert') && (
                          <SettingTableRow
                            setting={defaultAlert}
                            title={_('默认警报')}
                            type="alert"
                          />
                        )}
                        {capabilities.mayAccess('credential') && (
                          <SettingTableRow
                            setting={defaultEsxiCredential}
                            title={_('默认ESXi凭据')}
                            type="credential"
                          />
                        )}
                        {capabilities.mayAccess('scanconfig') && (
                          <SettingTableRow
                            setting={defaultOspScanConfig}
                            title={_('D默认OSP扫描配置')}
                            type="scanconfig"
                          />
                        )}
                        {capabilities.mayAccess('scanner') && (
                          <SettingTableRow
                            setting={defaultOspScanner}
                            title={_('默认OSP扫描仪')}
                            type="scanner"
                          />
                        )}
                        {capabilities.mayAccess('scanconfig') && (
                          <SettingTableRow
                            setting={defaultOpenvasScanConfig}
                            title={_('默认的OpenVAS扫描配置')}
                            type="scanconfig"
                          />
                        )}
                        {capabilities.mayAccess('scanner') && (
                          <SettingTableRow
                            setting={defaultOpenvasScanner}
                            title={_('默认的OpenVAS扫描仪')}
                            type="scanner"
                          />
                        )}
                        {capabilities.mayAccess('portlist') && (
                          <SettingTableRow
                            setting={defaultPortList}
                            title={_('默认端口列表')}
                            type="portlist"
                          />
                        )}
                        {capabilities.mayAccess('reportformat') && (
                          <SettingTableRow
                            setting={defaultReportFormat}
                            title={_('默认报告格式')}
                            type="reportformat"
                          />
                        )}
                        {capabilities.mayAccess('credential') && (
                          <SettingTableRow
                            setting={defaultSmbCredential}
                            title={_('默认SMB凭据')}
                            type="credential"
                          />
                        )}
                        {capabilities.mayAccess('credential') && (
                          <SettingTableRow
                            setting={defaultSnmpCredential}
                            title={_('默认SNMP凭据')}
                            type="credential"
                          />
                        )}
                        {capabilities.mayAccess('credential') && (
                          <SettingTableRow
                            setting={defaultSshCredential}
                            title={_('默认SSH凭据')}
                            type="credential"
                          />
                        )}
                        {capabilities.mayAccess('schedule') && (
                          <SettingTableRow
                            setting={defaultSchedule}
                            title={_('默认计划')}
                            type="schedule"
                          />
                        )}
                        {capabilities.mayAccess('target') && (
                          <SettingTableRow
                            setting={defaultTarget}
                            title={_('默认目标')}
                            type="target"
                          />
                        )}
                      </TableBody>
                    </Table>
                  </TabPanel>

                  {capabilities.mayAccess('filter') && (
                    <TabPanel>
                      <Table>
                        <colgroup width={FIRST_COL_WIDTH} />
                        <TableBody>
                          <SettingTableRow
                            setting={agentsFilter}
                            title={_('代理过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={alertsFilter}
                            title={_('警报过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={configsFilter}
                            title={_('配置过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={credentialsFilter}
                            title={_('凭据过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={filtersFilter}
                            title={_('过滤器的过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={hostsFilter}
                            title={_('主机过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={notesFilter}
                            title={_('注释过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={operatingSystemsFilter}
                            title={_('操作系统过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={overridesFilter}
                            title={_('复写过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={permissionsFilter}
                            title={_('权限过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={portListsFilter}
                            title={_('端口列表过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={reportsFilter}
                            title={_('报告过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={reportFormatsFilter}
                            title={_('报告格式过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={resultsFilter}
                            title={_('结果过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={rolesFilter}
                            title={_('角色过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={schedulesFilter}
                            title={_('计划过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={tagsFilter}
                            title={_('标签过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={targetsFilter}
                            title={_('目标过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={tasksFilter}
                            title={_('任务过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={cpeFilter}
                            title={_('CPE过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={cveFilter}
                            title={_('CVE过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={nvtFilter}
                            title={_('NVT过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={ovalFilter}
                            title={_('OVAL定义过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={certBundFilter}
                            title={_('CERT-Bund公告过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={dfnCertFilter}
                            title={_('DFN-CERT公告过滤器')}
                            type="filter"
                          />
                          <SettingTableRow
                            setting={secInfoFilter}
                            title={_('安全信息过滤器')}
                            type="filter"
                          />
                        </TableBody>
                      </Table>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </React.Fragment>
          )}
          {dialogVisible && !isLoading && (
            <SettingsDialog
              alerts={alerts}
              filters={filters}
              credentials={credentials}
              openVasScanConfigs={openVasScanConfigs}
              ospScanConfigs={ospScanConfigs}
              openVasScanners={openVasScanners}
              ospScanners={ospScanners}
              portLists={portlists}
              reportFormats={reportformats}
              schedules={schedules}
              targets={targets}
              timezone={timezone}
              userInterfaceLanguage={userInterfaceLanguage.value}
              rowsPerPage={rowsPerPage.value}
              maxRowsPerPage={maxRowsPerPage.value}
              detailsExportFileName={detailsExportFileName.value}
              listExportFileName={listExportFileName.value}
              reportExportFileName={reportExportFileName.value}
              autoCacheRebuild={autoCacheRebuild.value}
              severityClass={
                severityClass.value === '' ? undefined : severityClass.value
              }
              dynamicSeverity={dynamicSeverity.value}
              defaultSeverity={defaultSeverity.value}
              defaultAlert={defaultAlert.id}
              defaultEsxiCredential={defaultEsxiCredential.id}
              defaultOspScanConfig={defaultOspScanConfig.id}
              defaultOspScanner={defaultOspScanner.id}
              defaultOpenvasScanConfig={defaultOpenvasScanConfig.id}
              defaultOpenvasScanner={defaultOpenvasScanner.id}
              defaultPortList={defaultPortList.id}
              defaultReportFormat={defaultReportFormat.id}
              defaultSmbCredential={defaultSmbCredential.id}
              defaultSnmpCredential={defaultSnmpCredential.id}
              defaultSshCredential={defaultSshCredential.id}
              defaultSchedule={defaultSchedule.id}
              defaultTarget={defaultTarget.id}
              agentsFilter={agentsFilter.id}
              alertsFilter={alertsFilter.id}
              configsFilter={configsFilter.id}
              credentialsFilter={credentialsFilter.id}
              filtersFilter={filtersFilter.id}
              hostsFilter={hostsFilter.id}
              notesFilter={notesFilter.id}
              operatingSystemsFilter={operatingSystemsFilter.id}
              overridesFilter={overridesFilter.id}
              permissionsFilter={permissionsFilter.id}
              portListsFilter={portListsFilter.id}
              reportsFilter={reportsFilter.id}
              reportFormatsFilter={reportFormatsFilter.id}
              resultsFilter={resultsFilter.id}
              rolesFilter={rolesFilter.id}
              schedulesFilter={schedulesFilter.id}
              tagsFilter={tagsFilter.id}
              targetsFilter={targetsFilter.id}
              tasksFilter={tasksFilter.id}
              cpeFilter={cpeFilter.id}
              cveFilter={cveFilter.id}
              nvtFilter={nvtFilter.id}
              ovalFilter={ovalFilter.id}
              certBundFilter={certBundFilter.id}
              dfnCertFilter={dfnCertFilter.id}
              secInfoFilter={secInfoFilter.id}
              onClose={this.handleCloseDialog}
              onSave={this.handleSaveSettings}
              onValueChange={this.handleValueChange}
            />
          )}
        </Layout>
      </ErrorBoundary>
    );
  }
}

UserSettings.propTypes = {
  agentsFilter: PropTypes.object,
  alerts: PropTypes.array,
  alertsFilter: PropTypes.object,
  autoCacheRebuild: PropTypes.object,
  capabilities: PropTypes.capabilities.isRequired,
  certBundFilter: PropTypes.object,
  configsFilter: PropTypes.object,
  cpeFilter: PropTypes.object,
  credentials: PropTypes.array,
  credentialsFilter: PropTypes.object,
  cveFilter: PropTypes.object,
  defaultAlert: PropTypes.object,
  defaultEsxiCredential: PropTypes.object,
  defaultOpenvasScanConfig: PropTypes.object,
  defaultOpenvasScanner: PropTypes.object,
  defaultOspScanConfig: PropTypes.object,
  defaultOspScanner: PropTypes.object,
  defaultPortList: PropTypes.object,
  defaultReportFormat: PropTypes.object,
  defaultSchedule: PropTypes.object,
  defaultSeverity: PropTypes.object,
  defaultSmbCredential: PropTypes.object,
  defaultSnmpCredential: PropTypes.object,
  defaultSshCredential: PropTypes.object,
  defaultTarget: PropTypes.object,
  detailsExportFileName: PropTypes.object,
  dfnCertFilter: PropTypes.object,
  dynamicSeverity: PropTypes.object,
  filters: PropTypes.array,
  filtersFilter: PropTypes.object,
  gmp: PropTypes.gmp.isRequired,
  hostsFilter: PropTypes.object,
  isLoading: PropTypes.bool,
  listExportFileName: PropTypes.object,
  loadAlerts: PropTypes.func.isRequired,
  loadCredentials: PropTypes.func.isRequired,
  loadFilters: PropTypes.func.isRequired,
  loadPortLists: PropTypes.func.isRequired,
  loadReportFormats: PropTypes.func.isRequired,
  loadScanConfigs: PropTypes.func.isRequired,
  loadScanners: PropTypes.func.isRequired,
  loadSchedules: PropTypes.func.isRequired,
  loadSettings: PropTypes.func.isRequired,
  loadTargets: PropTypes.func.isRequired,
  maxRowsPerPage: PropTypes.object,
  notesFilter: PropTypes.object,
  nvtFilter: PropTypes.object,
  operatingSystemsFilter: PropTypes.object,
  ovalFilter: PropTypes.object,
  overridesFilter: PropTypes.object,
  permissionsFilter: PropTypes.object,
  portListsFilter: PropTypes.object,
  portlists: PropTypes.array,
  reportExportFileName: PropTypes.object,
  reportFormatsFilter: PropTypes.object,
  reportformats: PropTypes.array,
  reportsFilter: PropTypes.object,
  resultsFilter: PropTypes.object,
  rolesFilter: PropTypes.object,
  rowsPerPage: PropTypes.object,
  scanconfigs: PropTypes.array,
  scanners: PropTypes.array,
  schedules: PropTypes.array,
  schedulesFilter: PropTypes.object,
  secInfoFilter: PropTypes.object,
  setLocale: PropTypes.func.isRequired,
  setTimezone: PropTypes.func.isRequired,
  severityClass: PropTypes.object,
  tagsFilter: PropTypes.object,
  targets: PropTypes.array,
  targetsFilter: PropTypes.object,
  tasksFilter: PropTypes.object,
  timezone: PropTypes.string,
  userInterfaceLanguage: PropTypes.object,
  onInteraction: PropTypes.func.isRequired,
};

const mapStateToProps = rootState => {
  const userDefaultsSelector = getUserSettingsDefaults(rootState);

  const userInterfaceLanguage = userDefaultsSelector.getByName(
    'userinterfacelanguage',
  );
  const rowsPerPage = userDefaultsSelector.getByName('rowsperpage');
  const detailsExportFileName = userDefaultsSelector.getByName(
    'detailsexportfilename',
  );
  const listExportFileName = userDefaultsSelector.getByName(
    'listexportfilename',
  );
  const reportExportFileName = userDefaultsSelector.getByName(
    'reportexportfilename',
  );
  const maxRowsPerPage = userDefaultsSelector.getByName('maxrowsperpage');
  const autoCacheRebuild = userDefaultsSelector.getByName('autocacherebuild');

  const severityClass = userDefaultsSelector.getByName('severityclass');
  const defaultSeverity = userDefaultsSelector.getByName('defaultseverity');
  const dynamicSeverity = userDefaultsSelector.getByName('dynamicseverity');

  const defaultAlertId = userDefaultsSelector.getValueByName('defaultalert');
  const defaultEsxiCredentialId = userDefaultsSelector.getValueByName(
    'defaultesxicredential',
  );
  const defaultOspScanConfigId = userDefaultsSelector.getValueByName(
    'defaultospscanconfig',
  );
  const defaultOspScannerId = userDefaultsSelector.getValueByName(
    'defaultospscanner',
  );
  const defaultOpenvasScanConfigId = userDefaultsSelector.getValueByName(
    'defaultopenvasscanconfig',
  );
  const defaultOpenvasScannerId = userDefaultsSelector.getValueByName(
    'defaultopenvasscanner',
  );

  const defaultPortListId = userDefaultsSelector.getValueByName(
    'defaultportlist',
  );
  const defaultReportFormatId = userDefaultsSelector.getValueByName(
    'defaultreportformat',
  );
  const defaultSmbCredentialId = userDefaultsSelector.getValueByName(
    'defaultsmbcredential',
  );
  const defaultSnmpCredentialId = userDefaultsSelector.getValueByName(
    'defaultsnmpcredential',
  );
  const defaultSshCredentialId = userDefaultsSelector.getValueByName(
    'defaultsshcredential',
  );
  const defaultScheduleId = userDefaultsSelector.getValueByName(
    'defaultschedule',
  );
  const defaultTargetId = userDefaultsSelector.getValueByName('defaulttarget');

  const agentsFilterId = userDefaultsSelector.getValueByName('agentsfilter');
  const alertsFilterId = userDefaultsSelector.getValueByName('alertsfilter');
  const hostsFilterId = userDefaultsSelector.getValueByName('hostsfilter');
  const configsFilterId = userDefaultsSelector.getValueByName('configsfilter');
  const credentialsFilterId = userDefaultsSelector.getValueByName(
    'credentialsfilter',
  );
  const filtersFilterId = userDefaultsSelector.getValueByName('filtersfilter');
  const notesFilterId = userDefaultsSelector.getValueByName('notesfilter');
  const operatingSystemsFilterId = userDefaultsSelector.getValueByName(
    'operatingsystemsfilter',
  );
  const overridesFilterId = userDefaultsSelector.getValueByName(
    'overridesfilter',
  );
  const permissionsFilterId = userDefaultsSelector.getValueByName(
    'permissionsfilter',
  );
  const portListsFilterId = userDefaultsSelector.getValueByName(
    'portlistsfilter',
  );

  const reportsFilterId = userDefaultsSelector.getValueByName('reportsfilter');
  const reportFormatsFilterId = userDefaultsSelector.getValueByName(
    'reportformatsfilter',
  );
  const resultsFilterId = userDefaultsSelector.getValueByName('resultsfilter');
  const rolesFilterId = userDefaultsSelector.getValueByName('rolesfilter');
  const schedulesFilterId = userDefaultsSelector.getValueByName(
    'schedulesfilter',
  );
  const tagsFilterId = userDefaultsSelector.getValueByName('tagsfilter');

  const targetsFilterId = userDefaultsSelector.getValueByName('targetsfilter');
  const tasksFilterId = userDefaultsSelector.getValueByName('tasksfilter');
  const cpeFilterId = userDefaultsSelector.getValueByName('cpefilter');
  const cveFilterId = userDefaultsSelector.getValueByName('cvefilter');
  const certBundFilterId = userDefaultsSelector.getValueByName(
    'certbundfilter',
  );
  const dfnCertFilterId = userDefaultsSelector.getValueByName('dfncertfilter');
  const nvtFilterId = userDefaultsSelector.getValueByName('nvtfilter');
  const ovalFilterId = userDefaultsSelector.getValueByName('ovalfilter');
  const secInfoFilterId = userDefaultsSelector.getValueByName(
    'allsecinfofilter',
  );

  const alertsSel = alertsSelector(rootState);
  const credentialsSel = credentialsSelector(rootState);
  const filtersSel = filtersSelector(rootState);
  const portListsSel = portListsSelector(rootState);
  const reportFormatsSel = reportFormatsSelector(rootState);
  const scannersSel = scannersSelector(rootState);
  const scanConfigsSel = scanConfigsSelector(rootState);
  const schedulesSel = schedulesSelector(rootState);
  const targetsSel = targetsSelector(rootState);

  // select entities with these IDs
  const defaultAlert = alertsSel.getEntity(defaultAlertId);
  const defaultEsxiCredential = credentialsSel.getEntity(
    defaultEsxiCredentialId,
  );
  const defaultOspScanConfig = scanConfigsSel.getEntity(defaultOspScanConfigId);
  const defaultOspScanner = scannersSel.getEntity(defaultOspScannerId);
  const defaultOpenvasScanConfig = scanConfigsSel.getEntity(
    defaultOpenvasScanConfigId,
  );
  const defaultOpenvasScanner = scannersSel.getEntity(defaultOpenvasScannerId);
  const defaultPortList = portListsSel.getEntity(defaultPortListId);
  const defaultReportFormat = reportFormatsSel.getEntity(defaultReportFormatId);
  const defaultSmbCredential = credentialsSel.getEntity(defaultSmbCredentialId);
  const defaultSnmpCredential = credentialsSel.getEntity(
    defaultSnmpCredentialId,
  );
  const defaultSshCredential = credentialsSel.getEntity(defaultSshCredentialId);
  const defaultSchedule = schedulesSel.getEntity(defaultScheduleId);
  const defaultTarget = targetsSel.getEntity(defaultTargetId);
  const agentsFilter = filtersSel.getEntity(agentsFilterId);
  const alertsFilter = filtersSel.getEntity(alertsFilterId);
  const configsFilter = filtersSel.getEntity(configsFilterId);
  const credentialsFilter = filtersSel.getEntity(credentialsFilterId);
  const filtersFilter = filtersSel.getEntity(filtersFilterId);
  const hostsFilter = filtersSel.getEntity(hostsFilterId);
  const notesFilter = filtersSel.getEntity(notesFilterId);
  const operatingSystemsFilter = filtersSel.getEntity(operatingSystemsFilterId);
  const overridesFilter = filtersSel.getEntity(overridesFilterId);
  const permissionsFilter = filtersSel.getEntity(permissionsFilterId);
  const portListsFilter = filtersSel.getEntity(portListsFilterId);
  const reportsFilter = filtersSel.getEntity(reportsFilterId);
  const reportFormatsFilter = filtersSel.getEntity(reportFormatsFilterId);
  const resultsFilter = filtersSel.getEntity(resultsFilterId);
  const rolesFilter = filtersSel.getEntity(rolesFilterId);
  const schedulesFilter = filtersSel.getEntity(schedulesFilterId);
  const tagsFilter = filtersSel.getEntity(tagsFilterId);
  const targetsFilter = filtersSel.getEntity(targetsFilterId);
  const tasksFilter = filtersSel.getEntity(tasksFilterId);
  const cpeFilter = filtersSel.getEntity(cpeFilterId);
  const cveFilter = filtersSel.getEntity(cveFilterId);
  const certBundFilter = filtersSel.getEntity(certBundFilterId);
  const dfnCertFilter = filtersSel.getEntity(dfnCertFilterId);
  const nvtFilter = filtersSel.getEntity(nvtFilterId);
  const ovalFilter = filtersSel.getEntity(ovalFilterId);
  const secInfoFilter = filtersSel.getEntity(secInfoFilterId);

  let scanconfigs = scanConfigsSel.getEntities(ALL_FILTER);
  if (isDefined(scanconfigs)) {
    scanconfigs = scanconfigs.filter(filterEmptyScanConfig);
  }

  return {
    alerts: alertsSel.getEntities(ALL_FILTER),
    credentials: credentialsSel.getEntities(ALL_FILTER),
    filters: filtersSel.getEntities(ALL_FILTER),
    portlists: portListsSel.getEntities(ALL_FILTER),
    reportformats: reportFormatsSel.getEntities(ALL_FILTER),
    scanconfigs,
    scanners: scannersSel.getEntities(ALL_FILTER),
    schedules: schedulesSel.getEntities(ALL_FILTER),
    targets: targetsSel.getEntities(ALL_FILTER),
    timezone: getTimezone(rootState),
    userInterfaceLanguage,
    rowsPerPage,
    detailsExportFileName,
    listExportFileName,
    reportExportFileName,
    maxRowsPerPage,
    severityClass,
    defaultSeverity,
    dynamicSeverity,
    isLoading: userDefaultsSelector.isLoading(),
    defaultAlert,
    defaultEsxiCredential,
    defaultOspScanConfig,
    defaultOspScanner,
    defaultOpenvasScanConfig,
    defaultOpenvasScanner,
    defaultPortList,
    defaultReportFormat,
    defaultSmbCredential,
    defaultSnmpCredential,
    defaultSshCredential,
    defaultSchedule,
    defaultTarget,
    agentsFilter,
    alertsFilter,
    configsFilter,
    credentialsFilter,
    filtersFilter,
    hostsFilter,
    notesFilter,
    operatingSystemsFilter,
    overridesFilter,
    permissionsFilter,
    portListsFilter,
    reportsFilter,
    reportFormatsFilter,
    resultsFilter,
    rolesFilter,
    schedulesFilter,
    tagsFilter,
    targetsFilter,
    tasksFilter,
    cpeFilter,
    cveFilter,
    certBundFilter,
    dfnCertFilter,
    nvtFilter,
    ovalFilter,
    secInfoFilter,
    autoCacheRebuild,
  };
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  loadAlerts: () => dispatch(loadAlerts(gmp)(ALL_FILTER)),
  loadCredentials: () => dispatch(loadCredentials(gmp)(ALL_FILTER)),
  loadFilters: () => dispatch(loadFilters(gmp)(ALL_FILTER)),
  loadPortLists: () => dispatch(loadPortLists(gmp)(ALL_FILTER)),
  loadReportFormats: () => dispatch(loadReportFormats(gmp)(ALL_FILTER)),
  loadScanConfigs: () => dispatch(loadScanConfigs(gmp)(ALL_FILTER)),
  loadScanners: () => dispatch(loadScanners(gmp)(ALL_FILTER)),
  loadSchedules: () => dispatch(loadSchedules(gmp)(ALL_FILTER)),
  loadSettings: () => dispatch(loadUserSettingDefaults(gmp)()),
  loadTargets: () => dispatch(loadTargets(gmp)(ALL_FILTER)),
  loadAlert: id => dispatch(loadAlert(gmp)(id)),
  onInteraction: () => dispatch(renewSessionTimeout(gmp)()),
  setLocale: locale => gmp.setLocale(locale),
  setTimezone: timezone => dispatch(updateTimezone(gmp)(timezone)),
});

export default compose(
  withGmp,
  withCapabilities,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserSettings);

// vim: set ts=2 sw=2 tw=80:
