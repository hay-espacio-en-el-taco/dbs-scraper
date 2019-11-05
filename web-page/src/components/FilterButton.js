import React from 'react'

import './FilterButton.css'

const FilterButton = (props) => {
    const { id, fieldname, customClass, onClick } = props
    return <label
                id={id} 
                className={`${customClass ? 'filter-on' : ''} btn btn-secondary`}
                onClick={ () => onClick(id, fieldname) }
            >{id}</label>
}

export default FilterButton
