import React, { Component } from 'react';
class FilterBox extends Component {

    render() {
        const { onFilterRemove, id } = this.props;
        return (
            <li key={id}>
                <button className="waves-effect waves-light btn" onClick={() => onFilterRemove(id)}>
                    <span>{id}</span> | [X]
                </button>
            </li>
        )
    }
}

export default FilterBox;
