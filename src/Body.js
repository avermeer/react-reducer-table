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
import React, { useContext, useCallback } from 'react'
import Row from './Row'
import { TableDispatch, SELECTING } from './actions'
import PropTypes from 'prop-types'
import {
  TableStateType,
  ComponentsType,
  LayoutsType,
  LabelsType
} from './prop-types'
import './Body.css'

const Body = (props, ref) => {
  // console.log('Body', props)
  const { state, components, layouts, colOrder, labels, rowIdAttr } = props
  const { data, columns, selectedIds } = state
  const dispatch = useContext(TableDispatch)
  const handleCellCheckChange = useCallback(
    event => {
      // console.log('handleCellCheckChange', event)
      const id = event.target.dataset.id
      const newSelectedIds = new Set(selectedIds)
      if (event.target.checked) {
        newSelectedIds.add(id)
      } else {
        newSelectedIds.delete(id)
      }
      dispatch({
        type: SELECTING,
        selectedIds: newSelectedIds
      })
    },
    [selectedIds, dispatch]
  )
  return (
    <div ref={ref} className='rrt-tbody' onChange={handleCellCheckChange}>
      {data.map((row, index) => {
        // console.log('row', row)
        const id = row[rowIdAttr]
        const selected = rowIdAttr && selectedIds.has(id)
        return (
          <Row
            key={index}
            columns={columns}
            layouts={layouts}
            colOrder={colOrder}
            components={components}
            id={id}
            row={row}
            rowIdAttr={rowIdAttr}
            selected={selected}
            labels={labels}
          />
        )
      })}
    </div>
  )
}

Body.propTypes = {
  state: TableStateType,
  components: ComponentsType,
  layouts: LayoutsType,
  colOrder: PropTypes.string,
  rowIdAttr: PropTypes.string,
  labels: LabelsType
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prev.colOrder === next.colOrder &&
    prevState.data === nextState.data &&
    prevState.selectedIds === nextState.selectedIds
  /* if (!areEqual) {
    console.log('!Body.areEqual')
  } */
  return areEqual
}

export default React.memo(React.forwardRef(Body), areEqual)
