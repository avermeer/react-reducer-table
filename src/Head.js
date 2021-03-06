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
import HeaderCheckbox from './HeaderCheckbox'
import HeadContent from './HeadContent'
import PropTypes from 'prop-types'
import {
  TableStateType,
  ComponentsType,
  LayoutsType,
  LabelsType
} from './prop-types'
import './Head.css'

const Head = props => {
  // console.log('Head', props)
  const { state, components, layouts, overflow, rowIdAttr, labels } = props
  return (
    <div className='rrt-thead'>
      {
        <div className={`rrt-tr${overflow ? ' overflow' : ''}`}>
          {rowIdAttr ? (
            <HeaderCheckbox
              state={state}
              rowIdAttr={rowIdAttr}
              labels={labels}
            />
          ) : null}
          <HeadContent
            state={state}
            components={components}
            layouts={layouts}
          />
        </div>
      }
    </div>
  )
}

Head.propTypes = {
  state: TableStateType,
  components: ComponentsType,
  layouts: LayoutsType,
  rowIdAttr: PropTypes.string,
  overflow: PropTypes.bool,
  labels: LabelsType
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.columns === nextState.columns &&
    prevState.selectedIds === nextState.selectedIds &&
    prevState.sort === next.sort &&
    prevState.data === next.data &&
    prev.overflow === next.overflow
  /* if (!areEqual) {
    console.log('!Head.areEqual')
  } */
  return areEqual
}

export default React.memo(Head, areEqual)
