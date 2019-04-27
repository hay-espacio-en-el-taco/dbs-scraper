import React, { Component } from 'react';
class FilterBox extends Component {

    render() {
        const { onFilterRemove, id } = this.props;
        return (
            <li key={id}>
                <button className="waves-effect waves-light btn" onClick={_ => onFilterRemove(id)}>
                    <span>{id}</span> | Remove
                    {/* <i class="large material-icons">insert_chart</i> */}
                </button>
            </li>
        )
    }
}

export default FilterBox;
