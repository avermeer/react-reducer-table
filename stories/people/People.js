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
import React, {
  useRef,
  useEffect,
  useReducer,
  useMemo,
  useContext
} from 'react'
import { Table, TableDispatch } from '../../src'
import { ServerContext } from '../decorators'
import { createDatabase } from './model'
import { tableReducer, LOADING, RESET } from './peopleReducer'
import Pagination from './Pagination'
import { PeopleControls } from './PeopleControls'
import './People.css'
import ImageCell from './ImageCell'
import NameCell from './NameCell'
import CountryCell from './CountryCell'
import PhoneCell from './PhoneCell'
import EmailCell from './EmailCell'
import NameFilter from './NameFilter'
import CountryFilter from './CountryFilter'
import './Cell.css'

export const FiltersContext = React.createContext({ filter: null, query: null })

export const tableInit = value => {
  console.log('tableInit', value)
  const { fetchIdRef, dbsize, ...rest } = value
  return {
    database: createDatabase(dbsize),
    fetchIdRef,
    columns: [
      {
        id: 'name',
        Cell: NameCell,
        label: 'Name',
        Filter: NameFilter
      },
      {
        id: 'image',
        Cell: ImageCell,
        minWidth: 20,
        width: 20,
        sortable: false,
        resizable: false,
        label: 'Photo'
      },
      {
        id: 'country',
        Cell: CountryCell,
        label: 'Country',
        Filter: CountryFilter
      },
      {
        id: 'phone',
        Cell: PhoneCell,
        label: 'Phone'
      },
      {
        id: 'email',
        Cell: EmailCell,
        label: 'E-mail'
      }
    ],
    selectedIds: new Set(),
    canDelete: false,
    ...rest
  }
}

const People = props => {
  const { latency, dbsize } = useContext(ServerContext)
  const fetchIdRef = useRef(0)
  const initialArg = {
    fetchIdRef,
    latency,
    dbsize,
    data: [],
    total: 0,
    pageIndex: 0,
    pageCount: 0,
    pageSize: 100,
    loading: false,
    sort: '+name',
    filter: null,
    query: ''
  }
  const [state, dispatch] = useReducer(tableReducer, initialArg, tableInit)
  console.log('People', props, state)
  const {
    pageIndex,
    pageSize,
    sort,
    filter,
    query,
    canDelete,
    database
  } = state

  useEffect(() => {
    dispatch({ type: RESET, state: tableInit(initialArg) })
  }, [latency, dbsize])

  useEffect(() => {
    dispatch({
      type: LOADING,
      dispatch
    })
  }, [pageIndex, pageSize, sort, filter, query, database])

  const { countries } = database
  const filters = useMemo(() => {
    return { filter, query, countries }
  }, [filter, query, countries])

  return (
    <TableDispatch.Provider value={dispatch}>
      <FiltersContext.Provider value={filters}>
        <Table
          state={state}
          rowIdAttr='name'
          labels={{
            toggle: 'Toggle people selected',
            toggleAll: 'Toggle all people selected'
          }}
          components={{
            pagination: {
              type: Pagination,
              props: {
                pageSizes: [10, 20, 30, 50, 100, 200, 300, 500]
              }
            },
            paginationExtra: {
              type: PeopleControls,
              props: { canDelete }
            }
          }}
        />
      </FiltersContext.Provider>
    </TableDispatch.Provider>
  )
}

export default People
