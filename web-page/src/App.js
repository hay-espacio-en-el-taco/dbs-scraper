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
                <div className="row">
                    <div className="App-header grey darken-3 col s12 m5 l3">
                            <FilterBox />
                    </div>
                    <div className="col s12 m7 l9">
                        <CardsContainer />
                    </div>
                </div>
            </div>
        );
    }
}

export default App
