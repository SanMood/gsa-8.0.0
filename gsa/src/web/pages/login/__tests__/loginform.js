/* Copyright (C) 2019 Greenbone Networks GmbH
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

import {render, fireEvent} from 'web/utils/testing';

import LoginForm from '../loginform';

describe('LoginForm tests', () => {
  test('should render full LoginForm', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {baseElement} = render(
      <LoginForm
        error="An Error Occurred"
        showGuestLogin
        showLogin
        showProtocolInsecure
        onSubmit={handleSubmit}
        onGuestLoginClick={handleClick}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test('should display error', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {getByTestId} = render(
      <LoginForm
        error="An Error Occurred"
        onSubmit={handleSubmit}
        onGuestLoginClick={handleClick}
      />,
    );

    expect(getByTestId('error')).toHaveTextContent('An Error Occurred');
  });

  test('should not display error by default', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {queryByTestId} = render(
      <LoginForm onSubmit={handleSubmit} onGuestLoginClick={handleClick} />,
    );

    expect(queryByTestId('error')).not.toBeInTheDocument();
  });

  test('should display insecure protocol message', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {getByTestId} = render(
      <LoginForm
        showProtocolInsecure
        onSubmit={handleSubmit}
        onGuestLoginClick={handleClick}
      />,
    );

    expect(getByTestId('protocol-insecure')).toBeInTheDocument();
  });

  test('should not display insecure protocol message by default', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {queryByTestId} = render(
      <LoginForm onSubmit={handleSubmit} onGuestLoginClick={handleClick} />,
    );

    expect(queryByTestId('protocol-insecure')).toBeNull();
  });

  test('should display login fields by default', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {queryByName} = render(
      <LoginForm onSubmit={handleSubmit} onGuestLoginClick={handleClick} />,
    );

    expect(queryByName('username')).toBeInTheDocument();
    expect(queryByName('password')).toBeInTheDocument();
  });

  test('should allow to disable login fields', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {queryByName} = render(
      <LoginForm
        showLogin={false}
        onSubmit={handleSubmit}
        onGuestLoginClick={handleClick}
      />,
    );

    expect(queryByName('username')).not.toBeInTheDocument();
    expect(queryByName('password')).not.toBeInTheDocument();
  });

  test('should allow to login with username and password', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {getByName, getByTestId} = render(
      <LoginForm onSubmit={handleSubmit} onGuestLoginClick={handleClick} />,
    );

    const usernameField = getByName('username');
    const passwordField = getByName('password');

    fireEvent.change(usernameField, {target: {value: 'foo'}});
    fireEvent.change(passwordField, {target: {value: 'bar'}});

    const button = getByTestId('login-button');
    fireEvent.click(button);

    expect(handleSubmit).toBeCalledWith('foo', 'bar');
  });

  test('should not display guest login by default', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {queryByTestId} = render(
      <LoginForm onSubmit={handleSubmit} onGuestLoginClick={handleClick} />,
    );

    expect(queryByTestId('guest-login')).not.toBeInTheDocument();
    expect(queryByTestId('guest-login-button')).not.toBeInTheDocument();
  });

  test('should allow to display guest login', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {getByTestId} = render(
      <LoginForm
        showGuestLogin={true}
        onSubmit={handleSubmit}
        onGuestLoginClick={handleClick}
      />,
    );

    expect(getByTestId('guest-login')).toBeInTheDocument();
    expect(getByTestId('guest-login-button')).toBeInTheDocument();
  });

  test('should allow to login as guest', () => {
    const handleSubmit = jest.fn();
    const handleClick = jest.fn();

    const {getByTestId} = render(
      <LoginForm
        showGuestLogin={true}
        onSubmit={handleSubmit}
        onGuestLoginClick={handleClick}
      />,
    );

    const button = getByTestId('guest-login-button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
