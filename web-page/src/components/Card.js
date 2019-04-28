import React, { Component } from 'react';
import './Card.css'

class Card extends Component {

    render() {
        const { cardInfo } = this.props;
        const {
            type, cardName, energy, color, skillDescription, power, comboPower, comboEnergy,
            character, specialTrait, rarity, cardNumber, skillKeywords, relatedCharacters,
            relatedSpecialTraits, relatedCardNames, era, seriesName, seriesFullName, 
            availableDate, cardImageUrl, cardBack
        } = cardInfo

        return (
            <div className="col s12 card teal lighten-3" key={cardNumber}>
                <div className="col s12 m5 l3 card-image">
                        <img src={cardImageUrl} />
                </div>

                <div className="col s12 m7 l9 card-content">

                    <div className="row">
                        <div className="col s12">
                            <span className="card-title">{cardName} <sup>({cardNumber})</sup></span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s2">
                            {/* {content} */}
                            <span className="fieldname white-text">Type: </span><span className="field-data">{type}</span>
                        </div>

                        <div className="col s3">
                            <span className="fieldname white-text">Energy: </span><span className="field-data">{energy}</span>
                        </div>

                        <div className="col s2">
                            <span className="fieldname white-text">Color: </span><span className="field-data">{color}</span>
                        </div>

                        <div className="col s2">
                            <span className="fieldname white-text">Power: </span><span className="field-data">{power}</span>
                        </div>

                        <div className="col s12">
                            <span className="fieldname white-text">Skill: </span><span className="field-data">{skillDescription}</span>
                        </div>

                        <div className="col s3">
                            <span className="fieldname white-text">Combo Power: </span><span className="field-data">{comboPower}</span>
                        </div>

                        <div className="col s3">
                            <span className="fieldname white-text">Combo Energy: </span><span className="field-data">{comboEnergy}</span>
                        </div>

                        <div className="col s3">
                            <span className="fieldname white-text">Rarity: </span><span className="field-data">{rarity}</span>
                        </div>

                        <div className="col s2">
                            <span className="fieldname white-text">Era: </span><span className="field-data">{era}</span>
                        </div>

                        <div className="col s4">
                            <span className="fieldname white-text">Character: </span><span className="field-data">{character}</span>
                        </div>

                        <div className="col s4">
                            <span className="fieldname white-text">Special Trait: </span><span className="field-data">{specialTrait}</span>
                        </div>

                        <div className="col s12">
                            <span className="fieldname white-text">Skill Keywords: </span><span className="field-data">{skillKeywords.join(', ')}</span>
                        </div>

                        <div className="col s12">
                            <span className="fieldname white-text">Related Characters: </span><span className="field-data">{relatedCharacters.join(', ')}</span>
                        </div>

                        <div className="col s12">
                            <span className="fieldname white-text">Related Special Traits: </span><span className="field-data">{relatedSpecialTraits.join(', ')}</span>
                        </div>

                        <div className="col s12">
                            <span className="fieldname white-text">Related Card Names: </span><span className="field-data">{relatedCardNames.join(', ')}</span>
                        </div>

                        <div className="col s3">
                            <span className="fieldname white-text">Series Name: </span><span className="field-data">{seriesName}</span>
                        </div>

                        <div className="col s5">
                            <span className="fieldname white-text">Series Full Name: </span><span className="field-data">{seriesFullName}</span>
                        </div>

                        <div className="col s4">
                            <span className="fieldname white-text">Available Date: </span><span className="field-data">{availableDate}</span>
                        </div>

                        { cardBack ? (
                            <React.Fragment>
                                <div className="col s12">
                                    <span className="fieldname white-text">Card Name <sup>Card back</sup>: </span><span className="field-data">{cardBack.cardName}</span>
                                </div>
                                
                                <div className="col s2">
                                    <span className="fieldname white-text">Color <sup>Card back</sup>: </span><span className="field-data">{cardBack.color}</span>
                                </div>

                                <div className="col s3">
                                    <span className="fieldname white-text">Power <sup>Card back</sup>: </span><span className="field-data">{cardBack.power}</span>
                                </div>
                                
                                <div className="col s12">
                                    <span className="fieldname white-text">Skill <sup>Card back</sup>: </span><span className="field-data">{cardBack.skillDescription}</span>
                                </div>
                                
                                <div className="col s4">
                                    <span className="fieldname white-text">Character <sup>Card back</sup>: </span><span className="field-data">{cardBack.character}</span>
                                </div>

                                <div className="col s4">
                                    <span className="fieldname white-text">Special Trait <sup>Card back</sup>: </span><span className="field-data">{cardBack.specialTrait}</span>
                                </div>
                            </React.Fragment>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;
