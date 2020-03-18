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

import {KeyCode} from 'gmp/utils/event';
import {isDefined} from 'gmp/utils/identity';

import {parseCvssBaseVector, parseCvssBaseFromVector} from 'gmp/parser';

import SeverityBar from 'web/components/bar/severitybar';

import ErrorBoundary from 'web/components/errorboundary/errorboundary';

import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';
import TextField from 'web/components/form/textfield';

import CvssIcon from 'web/components/icon/cvssicon';
import ManualIcon from 'web/components/icon/manualicon';

import Layout from 'web/components/layout/layout';

import Section from 'web/components/section/section';

import {renewSessionTimeout} from 'web/store/usersettings/actions';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';

const StyledTextField = styled(TextField)`
  width: 180px;
`;

const ToolBarIcons = () => (
  <ManualIcon
    page="vulnerabilitymanagement"
    anchor="cvss"
    size="small"
    title={_('帮助：CVSS基本分数计算器')}
  />
);

class CvssCalculator extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      accessVector: 'LOCAL',
      accessComplexity: 'LOW',
      confidentialityImpact: 'NONE',
      authentication: 'NONE',
      integrityImpact: 'NONE',
      availabilityImpact: 'NONE',
      cvssVector: '',
      userVector: '',
      cvssScore: 0,
    };

    this.calculateScore = this.calculateScore.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleMetricsChange = this.handleMetricsChange.bind(this);
    this.handleVectorChange = this.handleVectorChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const {location} = this.props;

    if (
      isDefined(location) &&
      isDefined(location.query) &&
      isDefined(location.query.cvssVector)
    ) {
      const {cvssVector} = location.query;
      this.setState({cvssVector, userVector: cvssVector});
      this.calculateScore(cvssVector);
    }
  }

  calculateVector(newVector) {
    const {
      accessVector,
      accessComplexity,
      confidentialityImpact,
      authentication,
      integrityImpact,
      availabilityImpact,
    } = this.state;

    const cvssVector = parseCvssBaseVector({
      accessComplexity,
      accessVector,
      authentication,
      availabilityImpact,
      confidentialityImpact,
      integrityImpact,
      ...newVector,
    });

    this.setState({
      ...newVector,
      cvssVector,
      userVector: cvssVector,
    });

    this.calculateScore(cvssVector);
  }

  calculateScore(cvssVector) {
    const {gmp} = this.props;

    gmp.cvsscalculator.calculateScoreFromVector(cvssVector).then(response => {
      const {data: cvssScore} = response;
      this.setState({cvssScore});
    });
  }

  handleInteraction() {
    const {onInteraction} = this.props;
    if (isDefined(onInteraction)) {
      onInteraction();
    }
  }

  handleMetricsChange(value, name) {
    this.handleInteraction();

    this.calculateVector({[name]: value});
  }

  handleInputChange(value, name) {
    this.setState({[name]: value});
  }

  handleVectorChange() {
    const {userVector} = this.state;

    this.handleInteraction();

    const cvssValues = parseCvssBaseFromVector(userVector);
    const {
      accessVector,
      accessComplexity,
      confidentialityImpact,
      authentication,
      integrityImpact,
      availabilityImpact,
    } = cvssValues;

    if (
      isDefined(accessVector) &&
      isDefined(accessComplexity) &&
      isDefined(confidentialityImpact) &&
      isDefined(authentication) &&
      isDefined(integrityImpact) &&
      isDefined(availabilityImpact)
    ) {
      /* only override cvss values and vector if user vector has valid input */

      this.setState({...cvssValues, cvssVector: userVector});
      this.calculateScore(userVector);
    }
  }

  handleKeyDown(event) {
    const key_code = event.keyCode;
    if (key_code === KeyCode.ENTER) {
      this.handleVectorChange();
    }
  }

  render() {
    const {
      accessComplexity,
      accessVector,
      authentication,
      availabilityImpact,
      confidentialityImpact,
      userVector,
      cvssScore,
      cvssVector,
      integrityImpact,
    } = this.state;
    return (
      <ErrorBoundary errElement={_('page')}>
        <Layout flex="column">
          <ToolBarIcons />
          <Section
            img={<CvssIcon size="large" />}
            title={_('CVSS基本分数计算器')}
          />

          <h3>{_('从指标')}:</h3>
          <FormGroup title={_('访问向量')}>
            <Select
              items={[
                {
                  value: 'LOCAL',
                  label: _('本地'),
                },
                {
                  value: 'ADJACENT_NETWORK',
                  label: _('网上邻居'),
                },
                {
                  value: 'NETWORK',
                  label: _('网络'),
                },
              ]}
              name="accessVector"
              value={accessVector}
              menuPosition="adjust"
              onChange={this.handleMetricsChange}
            />
          </FormGroup>
          <FormGroup title={_('访问复杂性')}>
            <Select
              items={[
                {
                  value: 'LOW',
                  label: _('低危'),
                },
                {
                  value: 'MEDIUM',
                  label: _('中危'),
                },
                {
                  value: 'HIGH',
                  label: _('高危'),
                },
              ]}
              name="accessComplexity"
              value={accessComplexity}
              menuPosition="adjust"
              onChange={this.handleMetricsChange}
            />
          </FormGroup>
          <FormGroup title={_('身份验证')}>
            <Select
              items={[
                {
                  value: 'NONE',
                  label: _('无'),
                },
                {
                  value: 'SINGLE_INSTANCES',
                  label: _('单一'),
                },
                {
                  value: 'MULTIPLE_INSTANCES',
                  label: _('多重'),
                },
              ]}
              name="authentication"
              value={authentication}
              menuPosition="adjust"
              onChange={this.handleMetricsChange}
            />
          </FormGroup>
          <FormGroup title={_('机密性')}>
            <Select
              items={[
                {
                  value: 'NONE',
                  label: _('无'),
                },
                {
                  value: 'PARTIAL',
                  label: _('部分'),
                },
                {
                  value: 'COMPLETE',
                  label: _('全部'),
                },
              ]}
              name="confidentialityImpact"
              value={confidentialityImpact}
              onChange={this.handleMetricsChange}
            />
          </FormGroup>
          <FormGroup title={_('完整性')}>
            <Select
              items={[
                {
                  value: 'NONE',
                  label: _('无'),
                },
                {
                  value: 'PARTIAL',
                  label: _('部分'),
                },
                {
                  value: 'COMPLETE',
                  label: _('全部'),
                },
              ]}
              name="integrityImpact"
              value={integrityImpact}
              menuPosition="adjust"
              onChange={this.handleMetricsChange}
            />
          </FormGroup>
          <FormGroup title={_('可用性')}>
            <Select
              items={[
                {
                  value: 'NONE',
                  label: _('无'),
                },
                {
                  value: 'PARTIAL',
                  label: _('部分'),
                },
                {
                  value: 'COMPLETE',
                  label: _('全部'),
                },
              ]}
              name="availabilityImpact"
              value={availabilityImpact}
              menuPosition="adjust"
              onChange={this.handleMetricsChange}
            />
          </FormGroup>

          <h3>{_('从向量')}:</h3>
          <FormGroup title={_('向量')}>
            <StyledTextField
              name="userVector"
              value={userVector}
              onChange={this.handleInputChange}
              onBlur={this.handleVectorChange}
              onKeyDown={this.handleKeyDown}
            />
          </FormGroup>

          <h3>{_('结果')}:</h3>
          <FormGroup title={_('CVSS基本向量')}>
            <span>{cvssVector}</span>
          </FormGroup>
          <FormGroup title={_('严重程度')}>
            <SeverityBar severity={cvssScore} />
          </FormGroup>
        </Layout>
      </ErrorBoundary>
    );
  }
}

CvssCalculator.propTypes = {
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
)(CvssCalculator);

// vim: set ts=2 sw=2 tw=80:
