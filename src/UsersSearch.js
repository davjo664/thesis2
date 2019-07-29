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

import React, { useState } from 'react'
import {string, bool, shape} from 'prop-types'
import {stringify} from 'qs'
import UsersPane from './components/UsersPane'
import UsersSearchContext from './context/userssearch-context'

const UsersSearch = props => {
  const [state, setState] = useState({
    permissions: window.ENV.PERMISSIONS,
    rootAccountId: window.ENV.ROOT_ACCOUNT_ID,
    accountId: window.ENV.ACCOUNT_ID,
    roles: window.ENV.ROLES
  }) 

  const updateQueryParams = params => {
    const query = stringify(params)
    window.history.replaceState(null, null, `?${query}`)
  }

  return (
    <UsersSearchContext.Provider value={{
      permissions: state.permissions,
      rootAccountId: state.rootAccountId,
      accountId: state.accountId,
      roles: state.roles
    }}>
      <UsersPane
        {...{
          onUpdateQueryParams: updateQueryParams,
          queryParams: null
        }}
      />
    </UsersSearchContext.Provider>
  )
}

export default UsersSearch;
