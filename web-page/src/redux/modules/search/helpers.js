'use stric'

export const filterCards = (AllCards, filters = []) => {
    if (filters.length === 0) {
        return AllCards
    }

    return AllCards.filter(
        card => {
            for (let index = 0; index < filters.length; index++) {
                if (!filters[index].filterFn(card)) {
                    return false
                }
            }
            return true
        }
    )
}