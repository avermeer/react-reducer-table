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
import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { TableDispatch, SELECTING } from './actions'
import './HeaderCheckbox.css'

const HeaderCheckbox = props => {
  // console.log('HeaderCheckbox', props)
  const { state, rowIdAttr, labels } = props
  const { data, selectedIds } = state

  const dispatch = useContext(TableDispatch)

  const dataLength = data ? data.length : 0
  const allSelected =
    selectedIds.size !== 0 && selectedIds.size !== dataLength
      ? undefined
      : selectedIds.size === dataLength && dataLength > 0

  const handleChange = useCallback(
    event => {
      // console.log('handleHeaderCheckChange', event)
      dispatch({
        type: SELECTING,
        selectedIds: event.target.checked
          ? data.reduce((acc, row) => {
              acc.add(row[rowIdAttr])
              return acc
            }, new Set())
          : new Set()
      })
    },
    [data, rowIdAttr, dispatch]
  )
  return (
    <div className='rrt-th selection' onChange={handleChange}>
      <div className='rrt-header-checkbox'>
        <IndeterminateCheckbox
          indeterminate={allSelected === undefined}
          checked={allSelected === true}
          title={labels.toggleAll}
          disabled={dataLength === 0}
        />
      </div>
    </div>
  )
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.data === nextState.data &&
    prevState.selectedIds === nextState.selectedIds
  /* if (!areEqual) {
      console.log('!HeaderCheckbox.areEqual')
    } */
  return areEqual
}

export default React.memo(HeaderCheckbox, areEqual)
