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
import React, { useContext, useMemo } from 'react'
import './CountryFilter.css'
import { TableDispatch } from '../../src'
import { FiltersContext } from './People'
import { FILTERING } from './peopleReducer'
import Select from './Select'

const CountryFilter = props => {
  const { filter, countries } = useContext(FiltersContext)
  const dispatch = useContext(TableDispatch)
  const filterOptions = useMemo(
    () =>
      countries.map(country => ({
        label: country,
        value: country
      })),
    [countries]
  )
  return (
    <div className='country-filter'>
      <Select
        isSearchable
        isClearable
        options={filterOptions}
        value={filterOptions.find(({ value }) => value === filter) || null}
        onChange={country => {
          dispatch({ type: FILTERING, filter: country && country.value })
        }}
        menuPlacement='auto'
      />
    </div>
  )
}
export default CountryFilter
