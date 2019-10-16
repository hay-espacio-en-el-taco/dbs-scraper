import React from 'react';

import './FilterButton.css';

const FilterButton = (props) => {
    const { id, fieldname, customClass } = props;
    return <label
                id={id} 
                className={`${customClass ? 'filter-on' : ''} btn btn-secondary`}
                fieldname={fieldname}
                onClick={props.onClick}
            >{id}</label>;
}

export default FilterButton;