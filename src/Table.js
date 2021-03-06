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
import React, { useContext, useReducer, useMemo } from 'react'
import PropTypes from 'prop-types'
import { TableStateType, LabelsType, ComponentsType } from './prop-types'
import Header from './Header'
import Pagination from './Pagination'
import Data from './Data'
import Loading from './Loading'
import Empty from './Empty'
import ResizeBar from './ResizeBar'
import { TableDispatch, COLUMN_RESIZING } from './actions'
import {
  START_RESIZING,
  RESIZE,
  END_RESIZING,
  ResizerContext
} from './HeaderResizer'
import './Table.css'

const resizerReducer = (state, action) => {
  switch (action.type) {
    case START_RESIZING:
      return { ...state, barX: action.x, resizing: true }
    case RESIZE:
      return { ...state, barX: action.x }
    case END_RESIZING:
      state.dispatch({
        type: COLUMN_RESIZING,
        id: action.id,
        width: action.width
      })
      return { ...state, resizing: false }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * The `Table` component is the root component for this library.
 * It receives a reducer state (as a prop) and dispatcher (through the
 * `TableDispatch` React context).
 *
 * The table will trigger the following action to ask the reducer to alter its state.
 *
 * | Action            |  Parameters  | Description                                         |
 * |-------------------|--------------|-----------------------------------------------------|
 * | PAGING            | `<PagingType>` | Triggered when the user changes the page size or navigates to another page |
 * | COLUMN_REORDERING | `<ColumnsType>` | Triggered when the user reorders columns   |
 * | COLUMN_RESIZING   | `<ColumnsType>` | Triggered when the user resizes a column   |
 * | SELECTING   | `<SelectionType>` | Triggered when the user changes the row selection |
 * | SORTING   | `<SortType>` | Triggered when the user changes table sorting |
 *
 * `<PagingType>`
 *
 * | Key        | Type         | Description                                                                        |
 * |------------|--------------|--------------------------|
 * | pageIndex  | `<number>`   | The current page index   |
 * | pageSize   | `<number>`   | The pagination page size |
 *
 * `<ColumnsType>`
 *
 * | Key        | Type         | Description                                                                        |
 * |------------|--------------|--------------------------|
 * | columns  | `PropTypes.arrayOf(ColumnType)`   | The updated table columns |
 *
 * `<SelectionType>`
 *
 * | Key        | Type         | Description                                                                        |
 * |------------|--------------|--------------------------|
 * | selectedIds  | `<object>` | The updated Set of currently selected row ids |
 *
 * `<SortType>`
 *
 * | Key        | Type         | Description                                                                        |
 * |------------|--------------|--------------------------|
 * | sort  | `<string>` | The column id used for sorting, prefixed by '+' for ascending sort or '-' for descending sort (used only for sorting)|
 *
 */
const Table = props => {
  // console.log('Table', props)
  const {
    state,
    rowIdAttr,
    components: components_ = {},
    labels: labels_
  } = props

  const components = useMemo(() => {
    return {
      header: { type: Header, props: {} },
      tr: { type: 'div', props: {} },
      pagination: {
        type: Pagination,
        props: {
          pageSizes: [
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100,
            200,
            300,
            400,
            500
          ]
        }
      },
      paginationExtra: null,
      ...components_
    }
  }, [components_])

  const labels = useMemo(() => {
    return {
      loading: 'Loading...',
      noData: 'No rows found',
      toggle: 'Toggle people selected',
      toggleAll: 'Toggle all people selected',
      // eslint-disable-next-line no-template-curly-in-string
      rows: '${value} rows',
      page: 'Page',
      // eslint-disable-next-line no-template-curly-in-string
      ofPages: 'of ${pages}',
      // eslint-disable-next-line no-template-curly-in-string
      range: 'View ${first}-${last} of ${total}',
      firstPage: 'First page',
      lastPage: 'Last page',
      nextPage: 'Next page',
      previousPage: 'Previous page',
      ...labels_
    }
  }, [labels_])

  const [resizerState, resizerDispatch] = useReducer(resizerReducer, {
    resizing: false,
    barX: 0,
    dispatch: useContext(TableDispatch)
  })

  const { loading, data, pageCount, pageIndex } = state
  return (
    <ResizerContext.Provider value={resizerDispatch}>
      <div className='rrt-container'>
        <div
          className={`rrt-table${resizerState.resizing ? ' rtf-resizing' : ''}`}
        >
          <Data
            state={state}
            components={components}
            rowIdAttr={rowIdAttr}
            labels={labels}
          />
          {resizerState.resizing ? <ResizeBar x={resizerState.barX} /> : null}
          {loading ? <Loading labels={labels} /> : null}
          {!loading && (!data || data.length === 0) ? (
            <Empty title={labels.noData} />
          ) : null}
        </div>
        {pageCount !== undefined && pageIndex !== undefined
          ? React.createElement(components.pagination.type, {
              state,
              components,
              labels,
              ...components.pagination.props
            })
          : null}
      </div>
    </ResizerContext.Provider>
  )
}

Table.propTypes = {
  /**
   * The current state of the table, as computed by the reducer
   *
   * | Key             | Type              | Description                                         |
   * |-----------------|-------------------|-----------------------------------------------------|
   * | data | `PropTypes.arrayOf(PropTypes.object)` | An array of table rows |
   * | columns | `PropTypes.arrayOf(ColumnType)` | An array of table columns |
   * | total      | `<number>` | The total number of rows in the table (used only for pagination) |
   * | pageIndex | `<number>` | The current page index (used only for pagination) |
   * | pageSize  | `<number>` | The page size for table pages (used only for pagination) |
   * | pageCount | `<number>` | The total number of pages in the table (used only for pagination) |
   * | sort | `<string>` | The column id used for sorting, prefixed by '+' for ascending sort or '-' for descending sort (used only for sorting)
   * | selectedIds | `<object>` | a Set of ids currently selected (used only for selection)
   * | loading | `<bool>` | True if the table is loading its data
   *
   * `<ColumnType>` is an object, which contains the following keys:
   *
   * | Key             | Type              | Description                                         |
   * |-----------------|-------------------|-----------------------------------------------------|
   * | id              | `<string>`        | Unique id identifying the column
   * | label           | `<string>`        | The label to display for this column
   * | resizable       | `<bool>           | True if the column can be resized
   * | sortable        | `<bool>           | True if the column can be sorted
   * | minWidth        | `<number>         | The min width of the column (in pixels)
   * | width           | `<number>         | The default width of the column (in pixels)
   * | Cell            | `<elementType>    | The React component to use for cells corresponding to this column
   * | Filter          | `<elementType>    | A React component to use to specify a filter is the column can be filtered
   */
  state: TableStateType,
  /**
   * Add this property to activate row selection. It specifies
   * the column id which is the primary key for rows.
   */
  rowIdAttr: PropTypes.string,
  /**
   * A hash of custom components to replace those provided by the library:
   *
   * | Key             | Type              | Description                                         |
   * |-----------------|-------------------|-----------------------------------------------------|
   * | tr              | `<ComponentType>` | Component to instantiate to wrap each row       |
   * | Pagination      | `<ComponentType>` | Component to instantiate to provide pagination   |
   * | PaginationExtra | `<ComponentType>` | Component to instantiate to add extra information to the standard pagination component   |
   * | Header          | `<ComponentType>` | Component to instantiate for column header  |
   *
   * `<ComponentType>` is an object, which contains the following keys:
   *
   * | Key        | Type         | Description                                                                        |
   * |------------|--------------|------------------------------------------------------------------------------------|
   * | type      | `<elementType>`   | The React component type |
   * | props      | `<object>`   | A hash of React properties |
   */
  components: ComponentsType,
  /**
   * A hash of key to labels to customize labels used by the table:
   *
   * | Key             |  Description                                         |
   * |-----------------|------------------------------------------------------|
   * | loading         | Displayed while the table is loading data  |
   * | noData         | Displayed when there is no data in the table |
   * | toggle         | Title of the checkbox used to select a row |
   * | toggleAll         | Title of the checkbox used to select all rows                                         |
   * | rows         | In pagination, title of a page size (should contain a ${value} placeholder where the page size will be injected)  |
   * | page         | In pagination, 'page' label |
   * | ofPages         | In pagination, 'of pages' label (should contain a ${pages} placeholder where the number of available pages will be injected) |
   * | range         | In pagination, a label describing the current range being displayed (should contain ${first}, ${last} and ${total} placeholders where first row index, last row index, and total number of rows will be injected) |
   * | firstPage         | In pagination, title of the first page button |
   * | lastPage         | In pagination, title of the last page button |
   * | nextPage         | In pagination, title of the next page button |
   * | previousPage         | In pagination, title of the previous page button |
   */
  labels: LabelsType
}

export default Table
