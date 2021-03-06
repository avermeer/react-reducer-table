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
import PropTypes from 'prop-types'
import { ColumnsType, LayoutsType } from './prop-types'
import DefaultCell from './DefaultCell'
import './Row.css'

const RowContent = props => {
  // console.log('RowContent', props)
  const { row, layouts, columns } = props
  return (
    <>
      {columns.map((column, index) => {
        const { id, Cell = DefaultCell, resizable = true } = column
        const layout = layouts[id]
        const { className } = layout
        const shouldFlex = resizable && index === columns.length - 1
        return (
          <div
            key={index}
            className={`rrt-td ${className}${shouldFlex ? ' flex' : ''}`}
          >
            {React.createElement(Cell, { row, column })}
          </div>
        )
      })}
    </>
  )
}

RowContent.propTypes = {
  columns: ColumnsType,
  layouts: LayoutsType,
  colOrder: PropTypes.string,
  row: PropTypes.object
}

export const areEqual = (prev, next) => {
  const areEqual = prev.row === next.row && prev.colOrder === next.colOrder
  /* if (!areEqual) {
    console.log('!RowContent.areEqual')
  } */
  return areEqual
}

export default React.memo(RowContent, areEqual)
