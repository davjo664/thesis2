/*
 * Copyright (C) 2015 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import Table from '@instructure/ui-elements/lib/components/Table'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import React, { memo } from 'react'
import {arrayOf, string, object, func} from 'prop-types'
import UsersListRow from './UsersListRow'
import UsersListHeader from './UsersListHeader'

const UsersList = props => {
  return (
    <Table
      margin="small 0"
      caption={<ScreenReaderContent>{'Users'}</ScreenReaderContent>}
    >
      <thead>
        <tr>
          <UsersListHeader
            id="username"
            label={'Name'}
            tipDesc={'Click to sort by name ascending'}
            tipAsc={'Click to sort by name descending'}
            searchFilter={props.searchFilter}
          />
          <UsersListHeader
            id="email"
            label={'Email'}
            tipDesc={'Click to sort by email ascending'}
            tipAsc={'Click to sort by email descending'}
            searchFilter={props.searchFilter}
          />
          <UsersListHeader
            id="sis_id"
            label={'SIS ID'}
            tipDesc={'Click to sort by SIS ID ascending'}
            tipAsc={'Click to sort by SIS ID descending'}
            searchFilter={props.searchFilter}
          />
          <UsersListHeader
            id="last_login"
            label={'Last Login'}
            tipDesc={'Click to sort by last login ascending'}
            tipAsc={'Click to sort by last login descending'}
            searchFilter={props.searchFilter}
          />
          <th width="1" scope="col">
            <ScreenReaderContent>{'User option links'}</ScreenReaderContent>
          </th>
        </tr>
      </thead>
      <tbody data-automation="users list">
        {props.users.map(user => (
          <UsersListRow
            key={user.id}
            user={user}
          />
        ))}
      </tbody>
    </Table>
  )
}

UsersList.propTypes = {
  users: arrayOf(object).isRequired,
  searchFilter: object.isRequired
}

export default memo(
  UsersList, 
  (props, nextProps) => {
    let count = 0
    for (const prop in props) {
      ++count
      if (props[prop] !== nextProps[prop]) {
        // a change to searchFilter on it's own should not cause the list
        // to re-render
        if (prop !== 'searchFilter') {
          return true
        }
      }
    }
    return count !== Object.keys(nextProps).length
  }
)