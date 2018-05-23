import React, { Component } from 'react';
import { connect } from 'react-redux';
import { test } from './redux/modules/test'
import { searchCards } from './redux/modules/search'
import './App.css';

import Logo from './components/Logo';

const 
  mapStateToProps = state => ({ ...state }),
  mapDispatchToProps = { testAction: test, searchCards }

class App extends Component {

  onClickHandler() {
    this.props.testAction()
    this.props.searchCards()
  }

  render() {
    const { test: { testCount }, search: { result:cards } } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <Logo />
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.onClickHandler.bind(this)}>Get number of cards ({testCount})</button>
        { cards ? 
          <div>{`Total cards: ${cards.length}`}</div> : 
          null
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
