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

import parseLinkHeader from 'parse-link-header'
import ajaxJSON from '../jquery.ajaxJSON'

const getNextUrl = obj => obj && obj.links && obj.links.next && obj.links.next.url

/**
 * Build a store that support basic ajax fetching (first, next, all),
 * and caches the results by params.
 *
 * You only need to implement getUrl, and can optionally implement
 * normalizeParams and jsonKey
 */
export default function factory(spec) {
  return Object.assign(
    {
      normalizeParams: params => params,

      getUrl() {
        throw new Error('not implemented')
      },

      /**
       * If the API response is an object instead of an array, use this
       * to specify the key containing the actual array of results
       */
      jsonKey: null,

      /**
       * Load the first page of data for the given params
       */
      load(params) {
        // const key = this.getKey(params)
        const key = "";
        this.lastParams = params
        const normalizedParams = this.normalizeParams(params)
        const url = this.getUrl()

        return this._load(key, url, normalizedParams)
      },

      /**
       * Create a record; since we're lazy, just blow away all the store
       * data, but reload the last thing we fetched
       */
      create(params) {
        const url = this.getUrl()

        return ajaxJSON(url, 'POST', this.normalizeParams(params))
      },

      _load(key, url, params, options = {}) {
        ajaxJSON.abortRequest(this.previousLoadRequest)
        const xhr = ajaxJSON(url, 'GET', params)
        this.previousLoadRequest = xhr

        return xhr;
      },
    },
    spec
  )
}
