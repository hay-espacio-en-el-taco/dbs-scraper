import React, { Component } from 'react';
class FilterBox extends Component {

    render() {
        const { onFilterRemove, id } = this.props;
        return (
            <li key={id}>
                {id}
                <button onClick={_ => onFilterRemove(id)}>Remove</button>
            </li>
        )
    }
}

export default FilterBox;
