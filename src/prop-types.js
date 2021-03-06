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
import PropTypes from 'prop-types'

export const ColumnType = PropTypes.shape({
  id: PropTypes.string,
  label: PropTypes.string,
  resizable: PropTypes.bool,
  sortable: PropTypes.bool,
  minWidth: PropTypes.number,
  width: PropTypes.number,
  Cell: PropTypes.elementType,
  Filter: PropTypes.elementType
})

export const ColumnsType = PropTypes.arrayOf(ColumnType)

export const LayoutType = PropTypes.shape({
  className: PropTypes.string,
  rule: PropTypes.object
})

export const LayoutsType = PropTypes.objectOf(LayoutType)

export const TableStateType = PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(ColumnType),
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  pageCount: PropTypes.number,
  total: PropTypes.number,
  loading: PropTypes.bool,
  sort: PropTypes.string,
  selectedIds: PropTypes.object
})

export const LabelsType = PropTypes.shape({
  loading: PropTypes.string,
  noData: PropTypes.string,
  toggle: PropTypes.string,
  toggleAll: PropTypes.string,
  rows: PropTypes.string,
  page: PropTypes.string,
  ofPages: PropTypes.string,
  range: PropTypes.string,
  firstPage: PropTypes.string,
  lastPage: PropTypes.string,
  nextPage: PropTypes.string,
  previousPage: PropTypes.string
})

export const ComponentType = PropTypes.shape({
  type: PropTypes.elementType,
  props: PropTypes.object
})

export const ComponentsType = PropTypes.shape({
  header: ComponentType,
  tr: ComponentType,
  pagination: ComponentType,
  paginationExtra: ComponentType
})

export const IconType = PropTypes.oneOf([
  'up',
  'down',
  'first',
  'previous',
  'next',
  'last',
  'cancel'
])
