import React, { Component } from 'react';
import { connect } from 'react-redux';
import { test } from './redux/modules/test'
import logo from './logo.svg';
import './App.css';


const 
  mapStateToProps = state => ({ ...state }),
  mapDispatchToProps = { testAction: test }

class App extends Component {

  render() {
    const { testAction, test: { testCount } } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={testAction}>Test Redux Observable ({testCount})</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
