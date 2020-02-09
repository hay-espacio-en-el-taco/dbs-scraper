import React from 'react'
import { connect } from 'react-redux'
import { searchCards } from '../../redux/modules/search'
import { addFilter, updateFilter, removeFilter } from '../../redux/modules/search/filters'
import './index.css'

import CardTypeFilter from './CardTypeFilter'
import ColorFilter from './ColorFilter'
import EnergyFilter from './EnergyFilter'
import ComboEnergyFilter from './ComboEnergyFilter'
import FiltersApplied from './FiltersApplied'
import FilterBox from './FilterBox'

import { 
    getFieldsToSearch, 
} from './filter.utils'

const FilterSideBar = (props) => {
    const {
        totalCards, appliedFilters, fieldOptions, onFilterAdd,
        onFilterRemoved
    } = props

    return (
        <div className="col s12 filter-box white-text">
            <div className="row">
                <CardTypeFilter />
                <ColorFilter />
                <EnergyFilter />
                <ComboEnergyFilter />
                
                <div className="input-field col s12">
                    <select id="rarity" className="mx-auto btn-group-toggle btn-group">
                        <option value="">Rarity</option>
                        <option value="Common[C]">Common[C]</option>
                        <option value="Rare[R]">Rare[R]</option>
                        <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                        <option value="Super Rare[SR]">Super Rare[SR]</option>
                        <option value="Uncommon[UC]">Uncommon[UC]</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="input-field col s12">
                    <select id="character" className="mx-auto btn-group-toggle btn-group">
                        <option value="">Character</option>
                        <option value="Common[C]">Common[C]</option>
                        <option value="Rare[R]">Rare[R]</option>
                        <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                        <option value="Super Rare[SR]">Super Rare[SR]</option>
                        <option value="Uncommon[UC]">Uncommon[UC]</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="input-field col s12">
                    <select id="skillKeywords" className="mx-auto btn-group-toggle btn-group">
                        <option value="">Skill Keywords</option>
                        <option value="Common[C]">Common[C]</option>
                        <option value="Rare[R]">Rare[R]</option>
                        <option value="Starter Rare[ST]">Starter Rare[ST]</option>
                        <option value="Super Rare[SR]">Super Rare[SR]</option>
                        <option value="Uncommon[UC]">Uncommon[UC]</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <FilterBox 
                appliedFilters={appliedFilters}
                fieldOptions={fieldOptions}
                onFilterAdd={onFilterAdd}
            />

            <div className="row">
                <FiltersApplied filters={appliedFilters} onFilterRemoved={onFilterRemoved}/>
            </div>
            <div className="row">
                <span className="white-text">Total of cards: {totalCards}</span>
            </div>
        </div>
    )
}

const
    mapStateToProps = ({ search }) => ({
        totalCards: search.result.length,
        appliedFilters: search.filters,
        fieldOptions: getFieldsToSearch( search.cardsDictionary[ Object.keys(search.cardsDictionary)[4] ] )
    }),
    mapDispatchToProps = { searchCards, onFilterAdd: addFilter, onUpdateFilter: updateFilter, onFilterRemoved: removeFilter }
export default connect(mapStateToProps, mapDispatchToProps)(FilterSideBar)
