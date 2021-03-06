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
import React, { useMemo, useRef, useLayoutEffect, useState } from 'react'
import Head from './Head'
import Filters from './Filters'
import Body from './Body'
import { useId } from './hooks/useId'
import stylesheet from './stylesheet'
import './Data.css'
import PropTypes from 'prop-types'
import { TableStateType, ComponentsType, LabelsType } from './prop-types'

const styleSheet = stylesheet.createStyleSheet()

const Data = props => {
  // console.log('Data', props)
  const { state, components, rowIdAttr, labels } = props

  const { columns } = state

  // Create one rule-set per table instance nad instance creation time
  const dataId = useId()
  const layouts = useRef(null)
  if (layouts.current === null) {
    layouts.current = columns.reduce((layouts, column) => {
      const { id, minWidth = 80, width = 250 } = column
      const className = `rrt-${dataId.current}-${id}`
      layouts[id] = {
        className,
        rule: stylesheet.createRule(
          styleSheet,
          `.${className} { min-width: ${minWidth}px; width: ${width}px; }`
        )
      }
      return layouts
    }, {})
  }

  // To keep head and body columns align when body Y scroller appears.
  const [overflow, setOverflow] = useState(false)
  const ref = useRef(null)
  useLayoutEffect(() => {
    const node = ref.current
    setOverflow(node.scrollHeight > node.clientHeight)
  })

  const hasFilters = useMemo(() => columns.some(({ Filter }) => !!Filter), [
    columns
  ])

  // Keep track of the order of columns
  const colOrder = useMemo(() => columns.map(({ id }) => id).join(','), [
    columns
  ])

  return (
    <div className='rrt-data'>
      <Head
        state={state}
        components={components}
        layouts={layouts.current}
        labels={labels}
        rowIdAttr={rowIdAttr}
        overflow={overflow}
      />
      {hasFilters ? (
        <Filters
          state={state}
          layouts={layouts.current}
          rowIdAttr={rowIdAttr}
          overflow={overflow}
        />
      ) : null}
      <Body
        ref={ref}
        state={state}
        components={components}
        layouts={layouts.current}
        colOrder={colOrder}
        rowIdAttr={rowIdAttr}
        labels={labels}
      />
    </div>
  )
}

Data.propTypes = {
  state: TableStateType,
  rowIdAttr: PropTypes.string,
  components: ComponentsType,
  labels: LabelsType
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.columns === nextState.columns &&
    prevState.data === nextState.data &&
    prevState.selectedIds === nextState.selectedIds
  /* if (!areEqual) {
    console.log('!Data.areEqual')
  } */
  return areEqual
}

export default React.memo(Data, areEqual)
