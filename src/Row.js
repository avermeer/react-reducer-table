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
import React from 'react'
import CellCheckbox from './CellCheckbox'
import RowContent from './RowContent'
import PropTypes from 'prop-types'
import { ColumnsType, LayoutsType, ComponentsType } from './prop-types'
import './Row.css'

const Row = props => {
  // console.log('Row', props)
  const {
    components,
    row,
    layouts,
    colOrder,
    columns,
    selected,
    id,
    rowIdAttr,
    labels
  } = props
  const { tr } = components
  const rowProps = {
    className: `rrt-tr${selected ? ' rtf-selected' : ''}`,
    ...(typeof tr.type !== 'string' ? { row } : {}),
    ...tr.props
  }
  return React.createElement(tr.type, rowProps, [
    rowIdAttr ? (
      <div key='selection' className='rrt-td selection'>
        <CellCheckbox id={id} selected={selected} title={labels.toggle} />
      </div>
    ) : null,
    <RowContent
      key='content'
      columns={columns}
      layouts={layouts}
      colOrder={colOrder}
      row={row}
    />
  ])
}

Row.propTypes = {
  columns: ColumnsType,
  layouts: LayoutsType,
  colOrder: PropTypes.string,
  components: ComponentsType,
  row: PropTypes.object,
  selected: PropTypes.bool
}

export const areEqual = (prev, next) => {
  const areEqual =
    prev.row === next.row &&
    prev.selected === next.selected &&
    prev.colOrder === next.colOrder
  /*if (!areEqual) {
    console.log('!Row.areEqual')
  }*/
  return areEqual
}

export default React.memo(Row, areEqual)
