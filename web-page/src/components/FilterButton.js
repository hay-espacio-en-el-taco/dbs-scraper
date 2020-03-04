import React from 'react'
import './FilterButton.css'


const FilterButton = (props) => {
    const { 
        label = '', title,
        highlighted = false,
        id, onClick
    } = props

    const customClass = highlighted ? ' filter-on' : ''
    const className = 'btn btn-secondary' + customClass

    const idString = id || label
    const titleTxt = title || label

    return (
        <label id={idString} title={titleTxt} className={className} onClick={onClick}>
            {label}
        </label>
    )
}

export default FilterButton
