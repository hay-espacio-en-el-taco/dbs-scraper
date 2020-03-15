import React, {
    useEffect,
    useReducer,
    useRef
} from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import Card from './Card';

const MAX_PAGE_ITEMS = 20

function usePrevious(value) {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

const initialState = { pageNum: 1 }

function reducer(state, action) {
    switch (action.type) {
        case 'reset':
            return { pageNum: 0 };
        case 'newPageLoad':
            return { pageNum: state.pageNum + 1};
        default:
            throw new Error();
    }
}

function CardsContainer(props) {
    const { cards, hasFilters } = props
    const [{ pageNum }, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        dispatch({ type: 'reset' })
    }, [cards])

    const prevCards = usePrevious(cards)

    if ( !hasFilters ) {
        return 'Add some filters to search cards'
    }

    if (cards.length === 0) {
        return 'Found 0 cards with that criteria'
    }

    if (prevCards !== cards) {
        /*
         * This is a hack due to the very poor implementation of the
         * infinite scroll plugin. Maybe i should make my own.
         * 
         * Let's unmount the InfiniteScroll and wait for the next 
         * re-render in order to get the pagination reset.
         */
        return 'if you see this for more than a second, report it. It\'s a bug'
    }

    const pageLoadActionCretor = () => dispatch({ type: 'newPageLoad' })
    
    const cardItems = cards.slice(0, pageNum * MAX_PAGE_ITEMS).map(
        card => <Card key={card.cardNumber} cardInfo={card}/>
    )

    return (
        <InfiniteScroll
            pageStart={pageNum}
            loadMore={pageLoadActionCretor}
            initialLoad={true}
            hasMore={cardItems.length < cards.length}
            loader={<div className="loader" key={0}>Rendering more cards...</div>}
        >
            {cardItems}
        </InfiniteScroll>
    )
}

const
    mapStateToProps = ({ search }) => ({
        cards: search.result,
        hasFilters: search.filters.length > 0
    }),
    mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(CardsContainer);
