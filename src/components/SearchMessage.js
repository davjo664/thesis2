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

import React, {Component, useState, useEffect} from 'react'
import Billboard from '@instructure/ui-billboard/lib/components/Billboard'
import Pagination, {PaginationButton} from '@instructure/ui-pagination/lib/components/Pagination'
import Spinner from '@instructure/ui-elements/lib/components/Spinner'
import {array, func, string, shape, oneOf} from 'prop-types'
import View from '@instructure/ui-layout/lib/components/View'
import EmptyDesert from '../EmptyDesert'

const linkPropType = shape({
  url: string.isRequired,
  page: string.isRequired
}).isRequired

const SearchMessage = props => {

  const [state, setState] = useState({});

  useEffect(()=>{
    if (!props.collection.loading) {
      const newState = {}
      if (state.pageBecomingCurrent) newState.pageBecomingCurrent = null
      setState(newState)
    }
  }, [ props.collection ])

  const defaultProps = {
    getLiveAlertRegion() {
      return document.getElementById('flash_screenreader_holder')
    }
  }

  const handleSetPage = page => {
    setState({pageBecomingCurrent: page}, () => props.setPage(page))
  }

  const isLastPageUnknown = () => {
    return !props.collection.links.last
  }

  const currentPage = () => {
    return state.pageBecomingCurrent || Number(props.collection.links.current.page)
  }

  const lastKnownPageNumber = () => {
    const link =
      props.collection.links &&
      (props.collection.links.last || props.collection.links.next)

    if (!link) return 0
    return Number(link.page)
  }

  const renderPaginationButton = (pageIndex) => {
    const pageNumber = pageIndex + 1
    const isCurrent = state.pageBecomingCurrent
      ? pageNumber === state.pageBecomingCurrent
      : pageNumber === currentPage()
    return (
      <PaginationButton
        key={pageNumber}
        onClick={() => handleSetPage(pageNumber)}
        current={isCurrent}
        aria-label={`Page ${pageNumber}`}
      >
        {isCurrent && state.pageBecomingCurrent ? (
          <Spinner size="x-small" title={'Loading...'} />
        ) : (
          pageNumber
        )}
      </PaginationButton>
    )
  }

  const {collection, noneFoundMessage} = props
  const errorLoadingMessage = 'There was an error with your query; please try a different search'

  if (collection.error) {
    return (
      <div className="text-center pad-box">
        <div className="alert alert-error">{errorLoadingMessage}</div>
      </div>
    )
  } else if (collection.loading) {
    return (
      <View display="block" textAlign="center" padding="medium">
        <Spinner size="medium" title={'Loading...'} />
      </View>
    )
  } else if (!collection.data.length) {
    return (
      <Billboard size="large" heading={noneFoundMessage} headingAs="h2" hero={<EmptyDesert />} />
    )
  } else if (collection.links) {
    const lastPageNumber = lastKnownPageNumber()
    const lastIndex = lastPageNumber - 1
    const paginationButtons = Array.from(Array(lastPageNumber))
    paginationButtons[0] = renderPaginationButton(0)
    paginationButtons[lastIndex] = renderPaginationButton(lastIndex)
    const visiblePageRangeStart = Math.max(currentPage() - 10, 0)
    const visiblePageRangeEnd = Math.min(currentPage() + 10, lastIndex)
    console.log("visiblePageRangeStart",visiblePageRangeStart);
    console.log("visiblePageRangeEnd",visiblePageRangeEnd)
    for (let i = visiblePageRangeStart; i < visiblePageRangeEnd; i++) {
      paginationButtons[i] = renderPaginationButton(i)
    }

    return (
      <Pagination
        as="nav"
        variant="compact"
        labelNext={'Next Page'}
        labelPrev={'Previous Page'}
      >
        {paginationButtons.concat(
          isLastPageUnknown() ? (
            <span key="page-count-is-unknown-indicator" aria-hidden>
              ...
            </span>
          ) : (
            []
          )
        )}
      </Pagination>
    )
  } else {
    return <div />
  }
}

SearchMessage.propTypes = {
  collection: shape({
    data: array.isRequired,
    links: shape({current: linkPropType})
  }).isRequired,
  setPage: func.isRequired,
  noneFoundMessage: string.isRequired,
  getLiveAlertRegion: func,
  dataType: oneOf(['Course', 'User']).isRequired
}

export default SearchMessage;