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

import PropTypes from 'web/utils/proptypes';

import ErrorMessage from './errormessage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      info,
    });
  }

  render() {
    const {errElement = 'element'} = this.props;
    const message = _('在 {{eElement}} 中发生错误。', {
      eElement: errElement,
    });
    if (this.state.hasError) {
      return (
        <ErrorMessage message={message}>
          <span>{_('请再试一次')}</span>
        </ErrorMessage>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  errElement: PropTypes.string,
};

export default ErrorBoundary;

// vim: set ts=2 sw=2 tw=80:
