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

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';

import Dialog from 'web/components/dialog/dialog';
import DialogContent from 'web/components/dialog/content';
import DialogFooter from 'web/components/dialog/footer';
import DialogTitle from 'web/components/dialog/title';
import ScrollableContent from 'web/components/dialog/scrollablecontent';

class DialogNotification extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleShowError = this.handleShowError.bind(this);
    this.handleShowErrorMessage = this.handleShowErrorMessage.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
    this.handleShowSuccessMessage = this.handleShowSuccessMessage.bind(this);

    this.state = {};
  }

  handleShowError(error) {
    this.handleShowErrorMessage(error.message);
  }

  handleShowErrorMessage(message) {
    this.handleShowMessage(message, _('错误'));
  }

  handleShowSuccessMessage(message) {
    this.handleShowMessage(message, _('成功'));
  }

  handleShowMessage(message, subject = _('信息')) {
    this.setState({
      message,
      title: subject,
    });
  }

  handleDialogClose() {
    this.setState({message: undefined});
  }

  isDialogOpen() {
    return isDefined(this.state.message);
  }

  render() {
    const {children} = this.props;

    if (!isDefined(children)) {
      return null;
    }

    const {title, message} = this.state;
    return (
      <React.Fragment>
        {children({
          showError: this.handleShowError,
          showErrorMessage: this.handleShowErrorMessage,
          showMessage: this.handleShowMessage,
          showSuccessMessage: this.handleShowSuccessMessage,
        })}
        {this.isDialogOpen() && (
          <Dialog width="400px" onClose={this.handleDialogClose}>
            {({close, moveProps, heightProps}) => (
              <DialogContent>
                <DialogTitle
                  title={title}
                  onCloseClick={close}
                  {...moveProps}
                />
                <ScrollableContent {...heightProps}>
                  {message}
                </ScrollableContent>
                <DialogFooter title={_('关闭')} onClick={close} />
              </DialogContent>
            )}
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}

DialogNotification.propTypes = {
  children: PropTypes.func,
};

export default DialogNotification;

// vim: set ts=2 sw=2 tw=80:
