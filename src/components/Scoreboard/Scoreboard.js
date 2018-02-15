import React, { PureComponent } from 'react';
import { Country } from 'components';
import uuid from 'uuid';
import './Scoreboard.scss';
import { onGameScoreboard } from '../../services/SocketClient';
import PropTypes from 'prop-types';

class Scoreboard extends PureComponent {

    propTypes = {
        game: PropTypes.shape({
            isSaved: PropTypes.bool.isRequired,
            isTackled: PropTypes.bool.isRequired,
            currentTurnNumber: PropTypes.string.isRequired
        }),
    }

    getMockedCountry() {
        return {
            countryId: uuid(),
            name: "England",
            players: [],
        };
    }

    getResultField(game) {
        if(game.currentTurnNumber === 1){
            return "default";
        }
        var scoreFieldClassName = game.isSaved ? "safe" : "tackled";
        console.log(game.isSaved);
        scoreFieldClassName += game.currentTurnNumber;
        return scoreFieldClassName;
    }

    render() {
        return (
            <div>
                <div className="score-view__header">
                    <Country country={this.getMockedCountry()} />
                    <span className="scoreTally">00:00</span>
                    <Country country={this.getMockedCountry()} />
                </div>
                <div className={`score-view__field ${this.getResultField(this.props.game)}`}></div>
            </div>
        )
    }
}

export default Scoreboard;