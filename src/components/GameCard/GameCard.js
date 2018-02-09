import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './GameCard.scss';
import { Country } from 'components';

export default class GameCard extends PureComponent {
  static propTypes = {
    gameId: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    home: PropTypes.string.isRequired,
    away: PropTypes.string.isRequired,
    playerCount: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="game-card">
        <a onClick={() => this.props.onSelect(this.props.gameId)}>
          <div className="game-bg"></div>
          <div className="game-details">
            <span className="game-number">Game {this.props.number}</span>
            <span className="game-matchup caps">{this.props.home} vs {this.props.away}</span>
            <span className="player-requirements">{this.props.playerCount} Players Inside (Minimum 12 players)</span>
          </div>
          <div className="game-countries">
            <Country />
            <span className="game-vs">vs</span>
            <Country />
          </div>
        </a>
      </div>
    );
  }
}
