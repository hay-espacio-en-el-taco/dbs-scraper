import React, { Component } from 'react'
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css"
import './App.css'
import FilterSideBar from './components/FilterSideBar'
import CardsContainer from './components/CardsContainer'

class App extends Component {

    componentDidMount() {
        M.AutoInit()
    }

    render() {
        return (
            <div className="App">
                <div className="row">
                    <FilterSideBar />
                    <CardsContainer />
                </div>
            </div>
        )
    }
}

export default App
