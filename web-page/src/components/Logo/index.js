import React, { Component } from 'react';
import './Logo.css';

class Logo extends Component {
  render() {
    const dbsLogoUrl = 'http://dbs-cardgame.com/images/entrance/logo.png';
    return (
      <div className="logo-wrapper">
        <img src={dbsLogoUrl} alt="DBS Deck Builder"/>
      </div>
    );
  }
}

export default Logo;