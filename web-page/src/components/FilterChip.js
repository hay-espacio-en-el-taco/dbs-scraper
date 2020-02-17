import React from 'react';

const FilterChip = (props) => {
    const { onRemove, text } = props;
    return (
        <div className="chip">
            <span>{text}</span>
            <i className="material-icons filter-chip" onClick={onRemove}>close</i>
        </div>
    )
}

export default FilterChip