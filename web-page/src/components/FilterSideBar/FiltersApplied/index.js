import React from 'react'
import FilterChip from '../../FilterChip'
import { IDENTIFIER_PREFIX } from '../FilterButtonsRow'


const FiltersApplied = (props) => {
    const { filters, onFilterRemoved } = props
    const content = filters
    .filter( ({ id }) => !id.startsWith(IDENTIFIER_PREFIX))
    .map(
        ({ id }) => <FilterChip key={id} text={id} onRemove={() => onFilterRemoved(id)} />
    )

    return (
        <React.Fragment>
            {content}
        </React.Fragment>
    )
}

export default FiltersApplied