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

import React, { useReducer, useEffect, useState } from 'react'
import {shape, func, string} from 'prop-types'
import _ from 'underscore'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import UsersList from './UsersList'
import UsersToolbar from './UsersToolbar'
import SearchMessage from './SearchMessage'
import UserActions from '../actions/UserActions'
import UsersPaneContext from '../context/userspane-context'
import rootReducer from '../reducers/rootReducer';
import initialState from '../store/initialState';

const MIN_SEARCH_LENGTH = 3
export const SEARCH_DEBOUNCE_TIME = 750

const UsersPane = props => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [srMessageDisplayed, setSrMessageDisplayed] = useState(false);

  useEffect(() => {
    const {search_term, role_filter_id} = {...UsersToolbar.defaultProps, ...props.queryParams}
    dispatch(UserActions.updateSearchFilter({search_term, role_filter_id}));
    UserActions.applySearchFilter(MIN_SEARCH_LENGTH, state.searchFilter)(dispatch);
  }, [])

  useEffect(() => {
    debouncedDispatchApplySearchFilter()
  }, [ state.searchFilter ])

  const handleApplyingSearchFilter = () => {
    UserActions.applySearchFilter(MIN_SEARCH_LENGTH, state.searchFilter)(dispatch)
    updateQueryString()
  }

  const updateQueryString = () => {
    const searchFilter = state.searchFilter
    props.onUpdateQueryParams(searchFilter)
  }

  const debouncedDispatchApplySearchFilter = _.debounce(
    handleApplyingSearchFilter,
    SEARCH_DEBOUNCE_TIME
  )

  const handleUpdateSearchFilter = searchFilter => {
    dispatch(UserActions.updateSearchFilter({page: null, ...searchFilter}));
  }

  const handleSubmitEditUserForm = (attributes, id) => {
    handleApplyingSearchFilter()
  }

  const handleSetPage = page => {
    dispatch(UserActions.updateSearchFilter({page}))
    handleApplyingSearchFilter()
  }

  const {links, accountId, users, isLoading, errors, searchFilter} = state
  return (
    <div>
      <ScreenReaderContent>
        <h1>{'People'}</h1>
      </ScreenReaderContent>
      <UsersPaneContext.Provider value={{
        handleSubmitEditUserForm: handleSubmitEditUserForm,
        onUpdateFilters: handleUpdateSearchFilter
      }}>
      {
        <UsersToolbar
          onApplyFilters={handleApplyingSearchFilter}
          errors={errors}
          {...searchFilter}
          toggleSRMessage={(show = false) => {
            setSrMessageDisplayed(show);
          }}
        />
      }

      {!_.isEmpty(users) &&
        !isLoading && (
          <UsersList
            searchFilter={state.searchFilter}
            users={users}
          />
        )}
      <SearchMessage
        collection={{data: users, loading: isLoading, links}}
        setPage={handleSetPage}
        noneFoundMessage={'No users found'}
        dataType="User"
      />
      </UsersPaneContext.Provider>
    </div>
  )
}

UsersPane.propTypes = {
  onUpdateQueryParams: func.isRequired,
  queryParams: shape({
    page: string,
    search_term: string,
    role_filter_id: string
  }).isRequired
}

export default UsersPane;