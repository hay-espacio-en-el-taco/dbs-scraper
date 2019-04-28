import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css";
import './App.css';
import FilterBox from './components/FilterBox';
import CardsContainer from './components/CardsContainer';

class App extends Component {

    componentDidMount() {
        M.AutoInit();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header grey darken-3">
                    <div className="container">
                        <FilterBox />
                    </div>
                </header>
                <div className="row">
                    <CardsContainer />
                </div>
            </div>
        );
    }
}

export default App
