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

import PropTypes from 'web/utils/proptypes';

import DetailsIcon from 'web/components/icon/detailsicon';

import IconDivider from 'web/components/layout/icondivider';

import DetailsLink from 'web/components/link/detailslink';

import EntityBox from './box';

const NoteBox = ({note, detailsLink = true}) => {
  const toolbox = detailsLink ? (
    <IconDivider>
      <DetailsLink id={note.id} type="note" title={_('Note Details')}>
        <DetailsIcon />
      </DetailsLink>
    </IconDivider>
  ) : (
    undefined
  );
  return (
    <EntityBox
      title={_('注释')}
      text={note.text}
      end={note.endTime}
      toolbox={toolbox}
      modified={note.modificationTime}
    />
  );
};

NoteBox.propTypes = {
  detailsLink: PropTypes.bool,
  note: PropTypes.model.isRequired,
};

export default NoteBox;

// vim: set ts=2 sw=2 tw=80:
