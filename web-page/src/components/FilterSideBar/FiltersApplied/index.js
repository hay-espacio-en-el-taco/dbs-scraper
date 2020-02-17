import React, { useCallback } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { removeFilter } from '../../../redux/modules/search/filters'
import FilterChip from '../../FilterChip'

const selectFilters = ({ search }) => search.filters

export const IDENTIFIER_PREFIX = '_$hide:'
export default () => {
    const filters = useSelector(selectFilters)
    const dispatch = useDispatch()
    
    const dispatchRemoveFilter = useCallback(
        id => dispatch( removeFilter({id}) ),
        [dispatch]
    )

    const filtersToShow = filters.filter(
        ({ id }) => !id.startsWith(IDENTIFIER_PREFIX)
    )
    
    const content = filtersToShow.map(
        ({ id }, idx) => <FilterChip key={id + idx} text={id} onRemove={() => dispatchRemoveFilter(id)} />
    )

    return (
        <div className="col s12">
            {content}
        </div>
    )
}
