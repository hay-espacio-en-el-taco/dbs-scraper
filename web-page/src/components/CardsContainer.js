import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from './Card';


const MAX_CARDS_TO_SHOW = 200

class CardsContainer extends Component {

    render() {
        const { cards, hasFilters } = this.props

        if ( !hasFilters ) {
            return 'Add some filters to search cards'
        }

        if (cards.length === 0) {
            return 'Found 0 cards with that criteria'
        }

        const cardsComponent = cards.slice(0, MAX_CARDS_TO_SHOW).map( card => <Card key={card.cardNumber} cardInfo={card}/> )
        return (
            <React.Fragment>
                { cards.length > MAX_CARDS_TO_SHOW ? 
                    <div>Showing first {MAX_CARDS_TO_SHOW} cards</div>
                    : null
                }
                {cardsComponent}
            </React.Fragment>
        )
    }
}

const
    mapStateToProps = ({ search }) => ({
        cards: search.result,
        hasFilters: search.filters.length > 0
    }),
    mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(CardsContainer);
