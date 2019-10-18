import React, { Component } from 'react';
import './EnergyColor.css';

const
    reg = /[\dbugyr]+/g,
    filterColors = e => e.match(reg),
    iconPrinter = e => filterColors(e).map(i => {
        if (!isNaN(Number(i))) {
            let extraColors = filterColors(e).length-1
            if (i-extraColors > 0)
                return <span className="energy-color white">{i-extraColors}</span> 
            else
                return
        }

        switch (i) {
          case 'b':
              return <span className="energy-color light-blue accent-4"></span>
          case 'g':
              return <span className="energy-color green accent-4"></span>
          case 'r':
              return <span className="energy-color red accent-4"></span>
          case 'y':
              return <span className="energy-color yellow accent-2"></span>
          default:
              return <span className="energy-color white">{i}</span>
        }
    })

class EnergyColor extends Component {

    render() {
        const { energy } = this.props;
        if (!energy) return <span>{energy}</span>;

        return (
            <span key={energy}>
                {iconPrinter(energy)}
            </span>
        )
    }
}

export default EnergyColor;
