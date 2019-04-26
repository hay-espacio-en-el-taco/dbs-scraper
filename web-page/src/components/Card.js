import React, { Component } from 'react';
import M from "materialize-css";

class Card extends Component {

    componentDidMount() {
        M.AutoInit();
    }

    getFieldInfo = (key, label, info) => {
        let formattedInfo = typeof info === 'number' ? info : (info || ' - ')

        if (Array.isArray( formattedInfo )) {
            formattedInfo = formattedInfo.length > 0 ? formattedInfo.join(', ') : '-'
        }

        return (
            <p className={key} key={key}>
                <strong>{label}:</strong> {formattedInfo}
            </p>
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
            <div class="col s3" key={cardInfo.cardNumber}>
                <div class="card blue-grey darken-1">
                    <div class="card-image">
                        <img src={cardInfo.cardImageUrl} />
                    </div>
                    <div class="card-content white-text">
                        <span class="card-title">{cardInfo.cardName}</span>
                        <p>{content}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;
