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

import {KeyCode} from 'gmp/utils/event';
import {isDefined} from 'gmp/utils/identity';

import FormGroup from 'web/components/form/formgroup';
import PasswordField from 'web/components/form/passwordfield';
import Button from 'web/components/form/button';
import TextField from 'web/components/form/textfield';

import ProductImage from 'web/components/img/product';

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';

const Panel = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  padding-bottom: 10px;
  font-size: 9pt;
`;

const LoginPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Error = styled.p`
  color: ${Theme.warningRed};
  font-weight: bold;
  text-align: center;
  margin: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${Theme.lightGray};
  padding: 10px;
  margin-bottom: 10px;
`;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleSubmit() {
    const {onSubmit} = this.props;

    if (!isDefined(onSubmit)) {
      return;
    }

    const {username, password} = this.state;
    onSubmit(username, password);
  }

  handleValueChange(value, name) {
    this.setState({[name]: value});
  }

  handleKeyDown(event) {
    if (event.keyCode === KeyCode.ENTER) {
      this.handleSubmit(event);
    }
  }

  render() {
    const {
      error,
      showGuestLogin = false,
      showLogin = true,
      showProtocolInsecure = false,
      onGuestLoginClick,
    } = this.props;
    const {username, password} = this.state;
    return (
      <React.Fragment>
        <Wrapper>
          {showProtocolInsecure && (
            <Panel data-testid="protocol-insecure">
              <Error>{_('警告：连接未加密')}</Error>
              <p>
                {_(
                  '与此GSA的连接未加密，因此任何监听流量的人都可以窃取您的凭据。',
                )}
              </p>
              <p>
                {_(
                  '请为HTTPS服务配置TLS证书，或通知管理员尽快配置。',
                )}
              </p>
            </Panel>
          )}

          <LoginPanel>
            <ProductImage />

            {showLogin && (
              <Layout flex="column">
                <FormGroup title={_('用户名')} titleSize="4">
                  <TextField
                    autoComplete="username"
                    name="username"
                    placeholder={_('eg:sanmu')}
                    value={username}
                    autoFocus="autofocus"
                    tabIndex="1"
                    onChange={this.handleValueChange}
                  />
                </FormGroup>
                <FormGroup title={_('密 码')} titleSize="4">
                  <PasswordField
                    autoComplete="current-password"
                    name="password"
                    grow="1"
                    placeholder={_('密码')}
                    value={password}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleValueChange}
                  />
                </FormGroup>
                <FormGroup size="4" offset="4">
                  <Button
                    data-testid="login-button"
                    title={_('登录')}
                    onClick={this.handleSubmit}
                  />
                </FormGroup>
              </Layout>
            )}
          </LoginPanel>

          {isDefined(error) && (
            <Panel>
              <Error data-testid="error">{error}</Error>
            </Panel>
          )}
        </Wrapper>

        {showGuestLogin && (
          <Wrapper data-testid="guest-login">
            <LoginPanel>
              <Layout align={['center', 'center']}>
                <Button
                  data-testid="guest-login-button"
                  title={_('以来宾身份登录')}
                  onClick={onGuestLoginClick}
                />
              </Layout>
            </LoginPanel>
          </Wrapper>
        )}
      </React.Fragment>
    );
  }
}

LoginForm.propTypes = {
  error: PropTypes.string,
  showGuestLogin: PropTypes.bool,
  showLogin: PropTypes.bool,
  showProtocolInsecure: PropTypes.bool,
  onGuestLoginClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;

// vim: set ts=2 sw=2 tw=80:
