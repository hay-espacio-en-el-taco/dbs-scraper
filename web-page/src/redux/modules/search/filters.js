'use stric'
import { createSlice } from '@reduxjs/toolkit'

export const filtersSlice = createSlice({
    name: 'search/filters',
    initialState: [],
    reducers: {
        addFilter(state, action) {
            const { id, filter } = action.payload
            if (state.find(f => f.id === id)) {
                return// Avoid adding duplicated filters
            }
            state.push({ id, filterFn: filter })
        },
        removeFilter(state, action) {
            const { id } = action.payload
            const index = state.findIndex(f => f.id === id)
            if (-1 === index) {
                return// No filter found
            }
            state.splice(index, 1)
        },
        updateFilter(state, action) {
            const { id, newId, filter } = action.payload
            const filterFound = state.find(f => f.id === id)
            if (filterFound) {
                filterFound.id = newId || id
                filterFound.filterFn = filter
                return// Can't update a non existant filter
            }

            // Since no filter found, let's add a new filter instead
            state.push({ id: newId || id, filterFn: filter })
        },
        clearFilters() {
            return []
        }
    }
})

// Actions
export const { addFilter, removeFilter, updateFilter, clearFilters } = filtersSlice.actions

// Reducer
export default filtersSlice.reducer