import React, { Component } from 'react';
class FilterChip extends Component {

    render() {
        const { onRemove, text } = this.props;
        return (
            <div className="chip">
                {text}
                <i className="close material-icons" onClick={onRemove}>close</i>
            </div>
        )
    }
}

export default FilterChip;
