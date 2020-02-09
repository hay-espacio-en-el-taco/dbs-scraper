import React from 'react'
import './FilterButton.css'


const FilterButton = (props) => {
    const { 
        label = '', 
        highlighted = false,
        id, onClick
    } = props
    const customClass = highlighted ? ' filter-on' : ''

    return (
        <label id={id || label} className={'btn btn-secondary' + customClass} onClick={onClick}>
            {label}
        </label>
    )
}

export default FilterButton
