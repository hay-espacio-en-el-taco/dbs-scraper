import React, { Component } from 'react'
import './EnergyColor.css'

const
    reg = /[\dbugyr]+/g,
    filterColors = e => e.match(reg),
    iconPrinter = e => filterColors(e).map((i, index) => {
        const key = i + index
        if (!isNaN(Number(i))) {
            let extraColors = filterColors(e).length - 1
            if (i-extraColors > 0)
                return <span key={key} className="energy-color white">{i-extraColors}</span> 
            else
                return null
        }

        switch (i) {
          case 'b':
              return <span key={key} className="energy-color light-blue accent-4"></span>
          case 'g':
              return <span key={key} className="energy-color green accent-4"></span>
          case 'r':
              return <span key={key} className="energy-color red accent-4"></span>
          case 'y':
              return <span key={key} className="energy-color yellow accent-2"></span>
          default:
              return <span key={key} className="energy-color white">{i}</span>
        }
    })

class EnergyColor extends Component {

    render() {
        const { energy } = this.props
        if (!energy) {
            return <span>{energy}</span>
        }
        
        const energyIcons = iconPrinter(energy)
        return (
            <span>
                {energyIcons}
            </span>
        )
    }
}

export default EnergyColor
