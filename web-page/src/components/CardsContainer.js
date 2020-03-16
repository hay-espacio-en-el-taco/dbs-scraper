import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { VariableSizeList as List } from 'react-window';
import { connect } from 'react-redux';
import Card from './Card';


function CardsContainer(props) {
    const { cards, hasFilters } = props
    const cardContainerRef = useRef(null)
    const [, forceRender] = useState()
    
    console.log('Wow, such render')

    const resizeHandler = useCallback(() => {
        console.log('Wow, such resize')
        forceRender({})
    }, [])

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);
        console.log('Wow, such mounting')
        forceRender({})

        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
    }, [])

    const width = useMemo(() => {
        console.log('Wow, such node', cardContainerRef.current)

        if (!cardContainerRef.current) {
            return 400
        }

        return cardContainerRef.current.offsetWidth
    }, [cardContainerRef.current])


    let content = null
    switch(true) {
        case !hasFilters: {
            content = 'Add some filters to search cards'
            break
        }

        case !Array.isArray(cards) || cards.length === 0: {
            content = 'Found 0 cards with that criteria'
            break
        }

        default: {
            const cardRow = ({ index, style }) => (
                <Card style={style} cardInfo={cards[index]}/>
            );
            content = (
                <List
                    height={400}
                    itemCount={cards.length}
                    itemSize={() => 400}
                    width={width}
                >
                    {cardRow}
                </List>
            )
        }
    }

    console.log('Wow, such width', width)
    return (
        <div ref={cardContainerRef} className="col s12 m8 l9">
            {content}
        </div>
    )
}

const
    mapStateToProps = ({ search }) => ({
        cards: search.result,
        hasFilters: search.filters.length > 0
    }),
    mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(CardsContainer);
