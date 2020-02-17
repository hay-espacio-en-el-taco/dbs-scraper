import React, { Component } from 'react';
import './Card.css'
import EnergyColor from './EnergyColor';

class Card extends Component {

    render() {
        const { cardInfo } = this.props;
        const {
            type, cardName, energy, color, skillDescription, power, comboPower, comboEnergy,
            character, specialTrait, rarity, cardNumber, skillKeywords, relatedCharacters,
            relatedSpecialTraits, relatedCardNames, era, seriesName, seriesFullName, 
            cardImageUrl, cardBack
        } = cardInfo

        return (
            <div className="col s12 card teal lighten-3">
                <div className="row">
                    <div className="col m4 l3 card-image hide-on-small-only">
                        <img src={cardImageUrl} alt={cardName} />
                    </div>

                    <div className="col s12 m8 l9 card-content">
                        <div className="col s12">
                            <span className="card-title">{cardName} <sup>({cardNumber} {rarity})</sup></span>
                        </div>
                        <div className="row">
                            <div className="col s3">
                                <span className="fieldname white-text">Type:</span><span className="field-data">{type}</span>
                            </div>

                            <div className="col s3">
                                <span className="fieldname white-text">Color:</span><span className="field-data">{color}</span>
                            </div>

                            { ! (type === 'LEADER') ? (
                                <div className="col s6">
                                    <span className="fieldname white-text">Energy:</span>
                                    <span className="field-data"><EnergyColor energy={energy} /></span>
                                </div>
                                ) : null
                            }
                        </div>
                        { ! (type === 'EXTRA') ? (
                            <React.Fragment>
                            <div className="row">
                                <div className="col s3">
                                    <span className="fieldname white-text">Power:</span><span className="field-data">{power}</span>
                                </div>
                                { type === 'BATTLE' ? (
                                    <div className="col s4 l3">
                                        <span className="fieldname white-text">Combo:</span>
                                        <span className="field-data">
                                            <EnergyColor energy={comboEnergy}/>
                                            <span className="field-data">+ {comboPower}</span>
                                        </span>
                                    </div>
                                    ) : null
                                }

                                <div className="col s5 l6">
                                    <span className="fieldname white-text">Era:</span><span className="field-data">{era}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s6">
                                    <span className="fieldname white-text">Character:</span><span className="field-data">{character}</span>
                                </div>

                                <div className="col s6">
                                    <span className="fieldname white-text">Special Trait:</span><span className="field-data">{specialTrait}</span>
                                </div>
                            </div>

                            </React.Fragment>
                            ) : null
                        }
                        { relatedCharacters.length > 0 ? (
                            <div className="col s12 m6">
                                <span className="fieldname white-text">Related Characters:</span><span className="field-data">{relatedCharacters.join(', ')}</span>
                            </div>
                            ) : null
                        }
                        { relatedSpecialTraits.length > 0 ? (
                            <div className="col s12 m6">
                                <span className="fieldname white-text">Related Special Traits:</span><span className="field-data">{relatedSpecialTraits.join(', ')}</span>
                            </div>
                            ) : null
                        }
                        { relatedCardNames.length > 0 ? (
                            <div className="col s12 m6">
                                <span className="fieldname white-text">Related Card Names:</span><span className="field-data">{relatedCardNames.join(', ')}</span>
                            </div>
                            ) : null
                        }
                        <div className="col s12">
                            <span className="fieldname white-text">Series Full Name:</span><span className="field-data">{seriesName} - {seriesFullName}</span>
                        </div>
                        <div className="col s12">
                            <span className="fieldname white-text">Skill Keywords:</span><span className="field-data">{skillKeywords.join(', ')}</span>
                        </div>
                        <div className="col s12">
                            <span className="fieldname white-text">Skill:</span><span className="field-data"><pre>{skillDescription}</pre></span>
                        </div>
                    </div>
                </div>
                { cardBack ? (
                    <div className="row">
                        <div className="col m4 l3 card-image hide-on-small-only">
                            <img src={cardBack.cardImageUrl} alt={cardName} />
                        </div>
                        <div className="col s12 m8 l9 card-content">
                            <div className="row">
                                <div className="col s12">
                                    <span className="card-title">{cardBack.cardName}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s3">
                                    <span className="fieldname white-text">Type:</span><span className="field-data">{type}</span>
                                </div>

                                <div className="col s3">
                                    <span className="fieldname white-text">Color:</span><span className="field-data">{cardBack.color}</span>
                                </div>

                                <div className="col s3">
                                    <span className="fieldname white-text">Power:</span><span className="field-data">{cardBack.power}</span>
                                </div>

                                <div className="col s6">
                                    <span className="fieldname white-text">Character:</span><span className="field-data">{cardBack.character}</span>
                                </div>

                                <div className="col s6">
                                    <span className="fieldname white-text">Special Trait:</span><span className="field-data">{cardBack.specialTrait}</span>
                                </div>

                                { cardBack.relatedCharacters.length > 0 ? (
                                    <div className="col s12 m6">
                                        <span className="fieldname white-text">Related Characters:</span><span className="field-data">{cardBack.relatedCharacters.join(', ')}</span>
                                    </div>
                                    ) : null
                                }
                                { cardBack.relatedSpecialTraits.length > 0 ? (
                                    <div className="col s12 m6">
                                        <span className="fieldname white-text">Related Special Traits:</span><span className="field-data">{cardBack.relatedSpecialTraits.join(', ')}</span>
                                    </div>
                                    ) : null
                                }
                                { cardBack.relatedCardNames.length > 0 ? (
                                    <div className="col s12 m6">
                                        <span className="fieldname white-text">Related Card Names:</span><span className="field-data">{cardBack.relatedCardNames.join(', ')}</span>
                                    </div>
                                    ) : null
                                }
                                <div className="col s12">
                                    <span className="fieldname white-text">Skill Keywords:</span><span className="field-data">{cardBack.skillKeywords.join(', ')}</span>
                                </div>
                                <div className="col s12">
                                    <span className="fieldname white-text">Skill:</span><span className="field-data"><pre>{cardBack.skillDescription}</pre></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : null
                }

            </div>
        )
    }
}

export default Card;
