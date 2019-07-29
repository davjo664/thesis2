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

import React, { useContext } from 'react'
import {string, func, shape, arrayOf} from 'prop-types'
import IconGroupLine from '@instructure/ui-icons/lib/Line/IconGroup'
import IconMoreLine from '@instructure/ui-icons/lib/Line/IconMore'
import IconPlusLine from '@instructure/ui-icons/lib/Line/IconPlus'
import IconStudentViewLine from '@instructure/ui-icons/lib/Line/IconStudentView'

import Button from '@instructure/ui-buttons/lib/components/Button'
import FormFieldGroup from '@instructure/ui-form-field/lib/components/FormFieldGroup'
import {GridCol} from '@instructure/ui-layout/lib/components/Grid'
import Menu, {MenuItem} from '@instructure/ui-menu/lib/components/Menu'

import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Select from '@instructure/ui-core/lib/components/Select'
import TextInput from '@instructure/ui-forms/lib/components/TextInput'

import CreateOrUpdateUserModal from '../CreateOrUpdateUserModal'
import UsersSearchContext from '../context/userssearch-context'
import UsersPaneContext from '../context/userspane-context'

function preventDefault (fn) {
  return function (event) {
    if (event) event.preventDefault()
    return fn.apply(this, arguments)
  }
}

export default function UsersToolbar(props) {
  const usersSearchContext = useContext(UsersSearchContext);
  const usersPaneContext = useContext(UsersPaneContext);
  
  const placeholder = 'Search people...'
  return (
    <form onSubmit={preventDefault(props.onApplyFilters)}>
      <FormFieldGroup layout="columns" description="">
        <GridCol width="auto">
          <Select
            label={<ScreenReaderContent>{'Filter by user type'}</ScreenReaderContent>}
            value={props.role_filter_id}
            onChange={e => usersPaneContext.onUpdateFilters({role_filter_id: e.target.value})}
          >
            <option key="all" value="">
              {'All Roles'}
            </option>
            {usersSearchContext.roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </Select>
        </GridCol>

        <TextInput
          type="search"
          value={props.search_term}
          label={<ScreenReaderContent>{placeholder}</ScreenReaderContent>}
          placeholder={placeholder}
          onChange={e => usersPaneContext.onUpdateFilters({search_term: e.target.value})}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              props.toggleSRMessage(true)
            } else {
              props.toggleSRMessage(false)
            }
          }}
          onBlur={() => props.toggleSRMessage(true)}
          onFocus={() => props.toggleSRMessage(false)}
          messages={!!props.errors.search_term && [{type: 'error', text: props.errors.search_term}]}
        />

        <GridCol width="auto">
          {window.ENV.PERMISSIONS.can_create_users && (
            <CreateOrUpdateUserModal
              createOrUpdate="create"
              url={`/accounts/${usersSearchContext.accountId}/users`}
              afterSave={props.onApplyFilters} // update displayed results in case new user should appear
            >
              <Button aria-label={'Add people'}>
                <IconPlusLine />
                {'People'}
              </Button>
            </CreateOrUpdateUserModal>
          )}{' '}
          {renderKabobMenu(usersSearchContext.accountId)}
        </GridCol>
      </FormFieldGroup>
    </form>
  )
}

function renderKabobMenu(accountId) {
  const showAvatarItem = window.ENV.PERMISSIONS.can_manage_admin_users // see accounts_controller#avatars
  const showGroupsItem = window.ENV.PERMISSIONS.can_manage_groups // see groups_controller#context_index
  if (showAvatarItem || showGroupsItem) {
    return (
      <Menu
        trigger={
          <Button theme={{iconPlusTextMargin: '0'}}>
            <IconMoreLine margin="0" title={'More People Options'} />
          </Button>
        }
      >
        {showAvatarItem && (
          <MenuItem onClick={() => (window.location = `/accounts/${accountId}/avatars`)}>
            <IconStudentViewLine /> {'Manage profile pictures'}
          </MenuItem>
        )}
        {showGroupsItem && (
          <MenuItem onClick={() => (window.location = `/accounts/${accountId}/groups`)}>
            <IconGroupLine /> {'View user groups'}
          </MenuItem>
        )}
      </Menu>
    )
  }
  return null
}

UsersToolbar.propTypes = {
  toggleSRMessage: func.isRequired,
  onApplyFilters: func.isRequired,
  search_term: string,
  role_filter_id: string,
  errors: shape({search_term: string})
}

UsersToolbar.defaultProps = {
  search_term: '',
  role_filter_id: '',
  errors: {},
  handlers: {}
}
