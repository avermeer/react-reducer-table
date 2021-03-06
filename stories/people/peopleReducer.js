/*
Copyright 2020 Ulrich Gaal

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { delayedRun } from './utils'
import { decode, DESC } from '../../src'
import {
  PAGING,
  COLUMN_REORDERING,
  COLUMN_RESIZING,
  SELECTING,
  SORTING
} from '../../src'

export const RESET = 'RESET'
export const LOADING = 'LOADING'
export const END_LOADING = 'END_LOADING'
export const FILTERING = 'FILTERING'
export const DELETING = 'DELETING'
export const QUERYING = 'QUERYING'

export const tableReducer = (state, action) => {
  console.log('tableReducer', { state, action })
  const { columns } = state
  const {
    type,
    pageIndex,
    pageSize,
    pageCount,
    selectedIds,
    sort,
    filter,
    query,
    data,
    total,
    dispatch
  } = action
  switch (action.type) {
    case LOADING: {
      const fetchIdRef = state.fetchIdRef
      const fetchId = ++fetchIdRef.current
      getModels({ fetchId, dispatch, state })
      return { ...state, loading: true }
    }
    case END_LOADING: {
      return { ...state, loading: false, data, pageCount, total }
    }
    case DELETING:
      return {
        ...state,
        selectedIds: new Set(),
        ...deleteModels(state)
      }
    case SORTING:
      return { ...state, sort }
    case FILTERING:
      return { ...state, filter, pageIndex: 0 }
    case QUERYING:
      return { ...state, query, pageIndex: 0 }
    case PAGING:
      return {
        ...state,
        pageSize,
        pageIndex
      }
    case COLUMN_REORDERING:
      return { ...state, columns: action.columns }
    case COLUMN_RESIZING:
      return {
        ...state,
        columns: columns.map(column =>
          column.id === action.id ? { ...column, width: action.width } : column
        )
      }
    case SELECTING:
      return { ...state, selectedIds, canDelete: selectedIds.size > 0 }
    case RESET: {
      return action.state
    }
    default:
      throw new Error(`Unknown action: ${type}`)
  }
}

export const getModels = async params => {
  console.log('getModels', params)
  const { fetchId, dispatch, state } = params
  const {
    fetchIdRef,
    pageSize,
    pageIndex,
    sort,
    filter,
    query,
    database: { people },
    latency
  } = state
  let extract = people
  const data = await delayedRun(() => {
    if (sort) {
      const { order, name } = decode(sort)
      const direction = order === DESC ? -1 : 1
      extract = [...people].sort(
        (a, b) => a[name].localeCompare(b[name]) * direction
      )
      if (filter) {
        extract = extract.filter(({ country }) => country === filter)
      }
      if (query) {
        const regexp = new RegExp(query, 'i')
        extract = extract.filter(({ name }) => regexp.exec(name))
      }
    }
    // console.log('DATA', extract)
    return extract.slice(
      pageIndex * pageSize,
      Math.min((pageIndex + 1) * pageSize, people.length)
    )
  }, latency)
  if (fetchId === fetchIdRef.current) {
    const total = extract.length
    dispatch({
      type: END_LOADING,
      data,
      pageCount: Math.floor(total / pageSize) + (total % pageSize ? 1 : 0),
      total
    })
  }
}

export const deleteModels = state => {
  console.log('deleteModels', state)
  const { pageSize, pageIndex, sort, selectedIds, database } = state
  let { people } = database
  people = people.filter(({ name }) => !selectedIds.has(name))
  if (sort) {
    const { order, name } = decode(sort)
    const direction = order === DESC ? -1 : 1
    data = [...people].sort(
      (a, b) => a[name].localeCompare(b[name]) * direction
    )
  }
  data = people.slice(
    pageIndex * pageSize,
    Math.min((pageIndex + 1) * pageSize, people.length)
  )
  return { data, total: people.length, database: { ...database, people } }
}
