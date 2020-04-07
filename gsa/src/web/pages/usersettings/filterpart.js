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

import React from 'react';

import _ from 'gmp/locale';

import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';

import PropTypes from 'web/utils/proptypes';
import {renderSelectItems, UNSET_VALUE} from 'web/utils/render';
import withCapabilities from 'web/utils/withCapabilities';

const filterFilters = (filters, type) =>
  filters.filter(filter => filter.filter_type === type);

const FilterPart = ({
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
  cveFilter,
  cpeFilter,
  nvtFilter,
  ovalFilter,
  certBundFilter,
  dfnCertFilter,
  secInfoFilter,
  filters = [],
  onChange,
}) => {
  return (
    <React.Fragment>
      <FormGroup title={_('代理过滤器')} titleSize="3">
        <Select
          name="agentsFilter"
          value={agentsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'agent'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('警报过滤器')} titleSize="3">
        <Select
          name="alertsFilter"
          value={alertsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'alert'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('扫描配置过滤器')} titleSize="3">
        <Select
          name="configsFilter"
          value={configsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'config'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('票据过滤器')} titleSize="3">
        <Select
          name="credentialsFilter"
          value={credentialsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'credential'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('过滤器的过滤器')} titleSize="3">
        <Select
          name="filtersFilter"
          value={filtersFilter}
          items={renderSelectItems(
            filterFilters(filters, 'filter'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('主机过滤器')} titleSize="3">
        <Select
          name="hostsFilter"
          value={hostsFilter}
          items={renderSelectItems(filterFilters(filters, 'host'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('注释过滤器')} titleSize="3">
        <Select
          name="notesFilter"
          value={notesFilter}
          items={renderSelectItems(filterFilters(filters, 'note'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('操作系统过滤器')} titleSize="3">
        <Select
          name="operatingSystemsFilter"
          value={operatingSystemsFilter}
          items={renderSelectItems(filterFilters(filters, 'os'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('复写过滤器')} titleSize="3">
        <Select
          name="overridesFilter"
          value={overridesFilter}
          items={renderSelectItems(
            filterFilters(filters, 'override'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('权限过滤器')} titleSize="3">
        <Select
          name="permissionsFilter"
          value={permissionsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'permission'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('端口列表过滤器')} titleSize="3">
        <Select
          name="portListsFilter"
          value={portListsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'port_list'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('报告过滤器')} titleSize="3">
        <Select
          name="reportsFilter"
          value={reportsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'report'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('报告格式过滤器')} titleSize="3">
        <Select
          name="reportFormatsFilter"
          value={reportFormatsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'report_format'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('结果过滤器')} titleSize="3">
        <Select
          name="resultsFilter"
          value={resultsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'result'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('角色过滤器')} titleSize="3">
        <Select
          name="rolesFilter"
          value={rolesFilter}
          items={renderSelectItems(filterFilters(filters, 'role'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('计划')} titleSize="3">
        <Select
          name="schedulesFilter"
          value={schedulesFilter}
          items={renderSelectItems(
            filterFilters(filters, 'schedule'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('标签过滤器')} titleSize="3">
        <Select
          name="tagsFilter"
          value={tagsFilter}
          items={renderSelectItems(filterFilters(filters, 'tag'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('目标过滤器')} titleSize="3">
        <Select
          name="targetsFilter"
          value={targetsFilter}
          items={renderSelectItems(
            filterFilters(filters, 'target'),
            UNSET_VALUE,
          )}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('任务过滤器')} titleSize="3">
        <Select
          name="tasksFilter"
          value={tasksFilter}
          items={renderSelectItems(filterFilters(filters, 'task'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('CPE过滤器')} titleSize="3">
        <Select
          name="cpeFilter"
          value={cpeFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('CVE过滤器')} titleSize="3">
        <Select
          name="cveFilter"
          value={cveFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('NVT过滤器')} titleSize="3">
        <Select
          name="nvtFilter"
          value={nvtFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('OVAL定义过滤器')} titleSize="3">
        <Select
          name="ovalFilter"
          value={ovalFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('CERT-Bund公告过滤器')} titleSize="3">
        <Select
          name="certBundFilter"
          value={certBundFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('DFN-CERT公告过滤器')} titleSize="3">
        <Select
          name="dfnCertFilter"
          value={dfnCertFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title={_('安全信息过滤器')} titleSize="3">
        <Select
          name="secInfoFilter"
          value={secInfoFilter}
          items={renderSelectItems(filterFilters(filters, 'info'), UNSET_VALUE)}
          onChange={onChange}
        />
      </FormGroup>
    </React.Fragment>
  );
};

FilterPart.propTypes = {
  agentsFilter: PropTypes.string,
  alertsFilter: PropTypes.string,
  certBundFilter: PropTypes.string,
  configsFilter: PropTypes.string,
  cpeFilter: PropTypes.string,
  credentialsFilter: PropTypes.string,
  cveFilter: PropTypes.string,
  dfnCertFilter: PropTypes.string,
  filters: PropTypes.array,
  filtersFilter: PropTypes.string,
  hostsFilter: PropTypes.string,
  notesFilter: PropTypes.string,
  nvtFilter: PropTypes.string,
  operatingSystemsFilter: PropTypes.string,
  ovalFilter: PropTypes.string,
  overridesFilter: PropTypes.string,
  permissionsFilter: PropTypes.string,
  portListsFilter: PropTypes.string,
  reportFormatsFilter: PropTypes.string,
  reportsFilter: PropTypes.string,
  resultsFilter: PropTypes.string,
  rolesFilter: PropTypes.string,
  schedulesFilter: PropTypes.string,
  secInfoFilter: PropTypes.string,
  tagsFilter: PropTypes.string,
  targetsFilter: PropTypes.string,
  tasksFilter: PropTypes.string,
  onChange: PropTypes.func,
};

export default withCapabilities(FilterPart);

// vim: set ts=2 sw=2 tw=80:
