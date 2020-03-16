import React from 'react'
import { useSelector } from 'react-redux'
import './index.css'

import CardTypeFilter from './CardTypeFilter'
import ColorFilter from './ColorFilter'
import EnergyFilter from './EnergyFilter'
import ComboEnergyFilter from './ComboEnergyFilter'
import FiltersApplied from './FiltersApplied'
import RarityFilter from './RarityFilter'
import FilterBox from './FilterBox'

const totalCardsSelector = ({ search }) => search.result.length

const FilterSideBar = () => {
    const totalCards = useSelector(totalCardsSelector)

    return (
        <div className="App-header grey darken-3 col s12 m4 l3">
            <div className="col s12 filter-box white-text">
                <div className="row">
                    <span className="white-text">Total of cards: {totalCards}</span>
                </div>
                <div className="row">
                    <CardTypeFilter />
                    <ColorFilter />
                    <EnergyFilter />
                    <ComboEnergyFilter />
                    <RarityFilter />
                    
                    {/* <div className="input-field col s12">
                        <select id="character" className="mx-auto btn-group-toggle btn-group">
                            <option value="">Character</option>
                            <option value="Common[C]">Common[C]</option>
                            <option value="Rare[R]">Rare[R]</option>
                            <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                            <option value="Super Rare[SR]">Super Rare[SR]</option>
                            <option value="Uncommon[UC]">Uncommon[UC]</option>
                            <option value="Other">Other</option>
                        </select>
                    </div> */}
                    {/* <div className="input-field col s12">
                        <select id="skillKeywords" className="mx-auto btn-group-toggle btn-group">
                            <option value="">Skill Keywords</option>
                            <option value="Common[C]">Common[C]</option>
                            <option value="Rare[R]">Rare[R]</option>
                            <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                            <option value="Super Rare[SR]">Super Rare[SR]</option>
                            <option value="Uncommon[UC]">Uncommon[UC]</option>
                            <option value="Other">Other</option>
                        </select>
                    </div> */}
                </div>

                <FilterBox />

                <div className="row">
                    <FiltersApplied />
                </div>
            </div>
        </div>
    )
}

export default FilterSideBar