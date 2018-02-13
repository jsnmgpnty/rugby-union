import React, { PureComponent } from 'react';
import { Country } from 'components';
import uuid from 'uuid';
import './Scoreboard.scss';

class Scoreboard extends PureComponent {

    getMockedCountry() {
        return {
            countryId: uuid(),
            name: "England",
            players: [],
        };
    }
    // constructor(countryId, name, players) 

    render() {
        return (
            <div>
                <div className="score-view__header">
                    <Country country={this.getMockedCountry()} />
                    <span className="scoreTally">00:00</span>
                    <Country country={this.getMockedCountry()} />
                </div>
                <img className="score-view__field"/>
            </div>
        )
    }
}

export default Scoreboard;