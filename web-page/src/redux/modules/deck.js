'use stric';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/ignoreElements';

// Initial State
const initState = {
    deck: {}
}


// Actions
const
    ADD_CARD = 'dbs-scraper/deck/ADD_CARD',
    REMOVE_CARD = 'dbs-scraper/deck/REMOVE_CARD',
    RESET_DECK = 'dbs-scraper/deck/RESET_DECK'


// Reducer
export default function reducer(state = initState, action = {}) {
    switch(action.type) {

        case ADD_CARD: {
            const newDeck = { ...state.deck }
            if (newDeck[ action.card.cardNumber ] === undefined) {
                newDeck[ action.card.cardNumber ] = { 
                    cardData: action.card,
                    count: 0
                }
            }

            newDeck[ action.card.cardNumber ].count++
            return { ...state, ...{ deck: newDeck } }
        }

        case REMOVE_CARD: {
            if (state.deck[ action.card.cardNumber ] === undefined) {
                return state// Nothing to do, card was never in the deck
            }

            const newDeck = { ...state.deck }
            newDeck[ action.card.cardNumber ].count--
            if (newDeck[ action.card.cardNumber ].count < 1) {
                delete newDeck[ action.card.cardNumber ]
            }
            return { ...state, ...{ deck: newDeck } }
        }

        case RESET_DECK:
            return { ...state, ...{ deck: {} } }
        

        default:  return state
    }
}


// Action Creators
export const addCard = card => ({
    type: ADD_CARD,
    card
})

export const removeCard = card => ({
    type: REMOVE_CARD,
    card
})

export const resetDeck = () => ({
    type: RESET_DECK
})

