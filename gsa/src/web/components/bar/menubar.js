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

import styled from 'styled-components';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';
import withCapabilities from 'web/utils/withCapabilities';
import compose from 'web/utils/compose';

import Theme from 'web/utils/theme';

import Layout from 'web/components/layout/layout';

import Menu from 'web/components/menu/menu';
import MenuEntry from 'web/components/menu/menuentry';
import MenuHelpEntry from 'web/components/menu/menuhelpentry';
import MenuSection from 'web/components/menu/menusection';

const MENU_BAR_HEIGHT = '35px';

const Ul = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Wrapper = styled(Layout)`
  background-color: ${Theme.darkGray};
  height: ${MENU_BAR_HEIGHT};
  position: fixed;
  top: 42px;
  left: 0;
  right: 0;
  z-index: ${Theme.Layers.menu};
`;

const MenuBarPlaceholder = styled.div`
  height: ${MENU_BAR_HEIGHT};
`;

const MenuBar = ({gmp, capabilities}) => {
  if (!gmp.isLoggedIn() || !isDefined(capabilities)) {
    return null;
  }

  const may_op_scans = [
    'tasks',
    'reports',
    'results',
    'overrides',
    'notes',
    'tickets',
  ].reduce((sum, cur) => sum || capabilities.mayAccess(cur), false);

  const may_op_configuration = [
    'targets',
    'port_lists',
    'credentials',
    'scan_configs',
    'alerts',
    'schedules',
    'report_formats',
    'agents',
    'scanners',
    'filters',
    'tags',
    'permissions',
  ].reduce((sum, cur) => sum || capabilities.mayAccess(cur), false);

  const mayOpNotesOverrides = ['notes', 'overrides'].reduce(
    (sum, cur) => sum || capabilities.mayAccess(cur),
    false,
  );

  const mayOpAlertsSchedulesReportFormatsAgents = [
    'alerts',
    'schedules',
    'report_formats',
    'agents',
  ].reduce((sum, cur) => sum || capabilities.mayAccess(cur), false);

  const mayOpScannersFiltersTagsPermissions = [
    'scanners',
    'filters',
    'tags',
    'permissions',
  ].reduce((sum, cur) => sum || capabilities.mayAccess(cur), false);

  const may_op_admin =
    ['users', 'roles', 'groups'].reduce(
      (sum, cur) => sum || capabilities.mayAccess(cur),
      false,
    ) ||
    (capabilities.mayOp('describe_auth') && capabilities.mayOp('modify_auth'));
  return (
    <React.Fragment>
      <MenuBarPlaceholder />
      <Wrapper>
        <Ul>
          <Menu to="/" title={_('仪表盘')} />
          {may_op_scans && (
            <Menu title={_('扫描')}>
              {capabilities.mayAccess('tasks') && (
                <MenuEntry title={_('任务')} to="tasks" />
              )}
              {capabilities.mayAccess('reports') && (
                <MenuEntry title={_('报告')} to="reports" />
              )}
              {capabilities.mayAccess('results') && (
                <MenuEntry title={_('结果')} to="results" />
              )}
              {capabilities.mayAccess('vulns') && (
                <MenuEntry title={_('脆弱性')} to="vulnerabilities" />
              )}
              {capabilities.mayAccess('tickets') && (
                <MenuSection>
                  <MenuEntry title={_('修复票证')} to="tickets" />
                </MenuSection>
              )}
              {mayOpNotesOverrides && (
                <MenuSection>
                  {capabilities.mayAccess('notes') && (
                    <MenuEntry title={_('注释')} to="notes" />
                  )}
                  {capabilities.mayAccess('overrides') && (
                    <MenuEntry title={_('重写')} to="overrides" />
                  )}
                </MenuSection>
              )}
            </Menu>
          )}
          {capabilities.mayAccess('assets') && (
            <Menu title={_('资产')}>
              <MenuEntry title={_('主机')} to="hosts" />
              <MenuEntry title={_('操作系统')} to="operatingsystems" />
            </Menu>
          )}
          {capabilities.mayAccess('info') && (
            <Menu title={_('安全信息')}>
              <MenuEntry title={_('NVTs(网络虚拟终端)')} to="nvts" />
              <MenuEntry title={_('CVEs(公共漏洞和暴露)')} to="cves" />
              <MenuEntry title={_('CPEs(客户终端设备)')} to="cpes" />
              <MenuEntry title={_('OVAL(开放漏洞与评估语言)定义')} to="ovaldefs" />
              <MenuEntry title={_('CERT-Bund(德国国家计算机应急响应小组)公告')} to="certbunds" />
              <MenuEntry title={_('DFN-CERT(安全事件响应组织)公告')} to="dfncerts" />
              <MenuSection>
                <MenuEntry title={_('所有安全信息')} to="secinfos" />
              </MenuSection>
            </Menu>
          )}
          {may_op_configuration && (
            <Menu title={_('配置')}>
              {capabilities.mayAccess('targets') && (
                <MenuEntry title={_('目标')} to="targets" />
              )}
              {capabilities.mayAccess('port_lists') && (
                <MenuEntry title={_('端口列表')} to="portlists" />
              )}
              {capabilities.mayAccess('credentials') && (
                <MenuEntry title={_('证书')} to="credentials" />
              )}
              {capabilities.mayAccess('configs') && (
                <MenuEntry title={_('扫描配置')} to="scanconfigs" />
              )}
              {mayOpAlertsSchedulesReportFormatsAgents && (
                <MenuSection>
                  {capabilities.mayAccess('alerts') && (
                    <MenuEntry title={_('警报')} to="alerts" />
                  )}
                  {capabilities.mayAccess('schedules') && (
                    <MenuEntry title={_('计划')} to="schedules" />
                  )}
                  {capabilities.mayAccess('report_formats') && (
                    <MenuEntry title={_('报表格式')} to="reportformats" />
                  )}
                  {capabilities.mayAccess('agents') && (
                    <MenuEntry title={_('代理')} to="agents" />
                  )}
                </MenuSection>
              )}
              {mayOpScannersFiltersTagsPermissions && (
                <MenuSection>
                  {capabilities.mayAccess('scanners') && (
                    <MenuEntry title={_('扫描仪')} to="scanners" />
                  )}
                  {capabilities.mayAccess('filters') && (
                    <MenuEntry title={_('过滤器')} to="filters" />
                  )}
                  {capabilities.mayAccess('tags') && (
                    <MenuEntry title={_('标签')} to="tags" />
                  )}
                  {capabilities.mayAccess('permissions') && (
                    <MenuEntry title={_('权限')} to="permissions" />
                  )}
                </MenuSection>
              )}
            </Menu>
          )}
          <Menu title={_('其它')}>
            <MenuEntry title={_('回收站')} to="trashcan" />
            <MenuEntry title={_('我的设置')} to="usersettings" />
            {capabilities.mayAccess('system_reports') && (
              <MenuEntry
                title={_('性能')}
                caps="get_system_reports"
                to="performance"
              />
            )}
            <MenuEntry title={_('CVSS计算器')} to="cvsscalculator" />
            {capabilities.mayAccess('feeds') && (
              <MenuEntry
                title={_('输送状态')}
                to="feedstatus"
                caps="get_feeds"
              />
            )}
          </Menu>
          {may_op_admin && (
            <Menu title={_('管理')}>
              {capabilities.mayAccess('users') && (
                <MenuEntry title={_('用户')} to="users" />
              )}
              {capabilities.mayAccess('groups') && (
                <MenuEntry title={_('组s')} to="groups" />
              )}
              {capabilities.mayAccess('roles') && (
                <MenuEntry title={_('角色')} to="roles" />
              )}
              <MenuSection>
                {capabilities.mayOp('describe_auth') &&
                  capabilities.mayOp('modify_auth') && (
                    <MenuEntry title={_('LDAP')} to="ldap" />
                  )}
                {capabilities.mayOp('describe_auth') &&
                  capabilities.mayOp('modify_auth') && (
                    <MenuEntry title={_('Radius')} to="radius" />
                  )}
              </MenuSection>
            </Menu>
          )}
          <Menu title={_('帮助')}>
            <MenuHelpEntry title={_('目录')} />
            <MenuEntry title={_('关于')} to="about" />
          </Menu>
        </Ul>
      </Wrapper>
    </React.Fragment>
  );
};

MenuBar.propTypes = {
  capabilities: PropTypes.capabilities,
  gmp: PropTypes.gmp.isRequired,
};

export default compose(
  withCapabilities,
  withGmp,
)(MenuBar);

// vim: set ts=2 sw=2 tw=80:
