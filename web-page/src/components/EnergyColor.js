import React, { Component } from 'react';
import './EnergyColor.css';

const
    reg = /[\dbugyr]+/g,
    filterColors = e => e.match(reg),
    iconPrinter = e => filterColors(e).map((i) => {
        if (!isNaN(Number(i))) {
          return <div className="energy-color white">{i}</div>
        }

        switch (i) {
          case 'b':
              return <div className="energy-color light-blue accent-4"></div>
          case 'g':
              return <div className="energy-color green accent-4"></div>
          case 'r':
              return <div className="energy-color red accent-4"></div>
          case 'y':
              return <div className="energy-color yellow accent-2"></div>
          default:
              return <div className="energy-color white">{i}</div>
        }
    })

class EnergyColor extends Component {

    render() {
        const { energy } = this.props;
        if (!energy) return <div>{energy}</div>;

        return (
            <div key={energy}>
                {iconPrinter(energy)}
            </div>
        )
    }
}

export default EnergyColor;
