import React, { Component } from 'react';

class Card extends Component {

    getFieldInfo = (key, label, info) => {
        let formattedInfo = typeof info === 'number' ? info : (info || ' - ')

        if (Array.isArray( formattedInfo )) {
            formattedInfo = formattedInfo.length > 0 ? formattedInfo.join(', ') : '-'
        }

        return (
            <li className={key} key={key}>
                {label}: {formattedInfo}
            </li>
        )
    }
    

    render() {
        const { cardInfo } = this.props;

        const content = Object.keys(cardInfo).map(
            fieldName => {
                if ( cardInfo[ fieldName ] && typeof cardInfo[ fieldName ] === 'object' && !Array.isArray(cardInfo[ fieldName ]) ) {
                    const objectContent = Object.keys(cardInfo[fieldName]).map(
                        backFieldName => this.getFieldInfo(`${fieldName}-${backFieldName}`, `${fieldName}.${backFieldName}`, cardInfo[fieldName][backFieldName])
                    )
                    return ( <React.Fragment> {objectContent} </React.Fragment> )
                }

                return this.getFieldInfo(fieldName, fieldName, cardInfo[fieldName])
            }
        )

        return (
            <ul key={cardInfo.cardNumber}>
                {content}
            </ul>
        )
    }
}

export default Card;
