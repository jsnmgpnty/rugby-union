import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './GameCard.scss';
import { Country } from 'components';

export default class GameCard extends PureComponent {
  static propTypes = {
    game: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired,
    home: PropTypes.object.isRequired,
    away: PropTypes.object.isRequired,
    playerCount: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
  };

  static defaultProps ={
    isSelected: false,
  };

  render() {
    return (
      <div className="game-card">
        <a onClick={() => this.props.onSelect(this.props.game)}>
          <div className="game-bg"></div>
          <div className={`game-details ${this.props.isSelected ? 'is-selected' : ''}`}>
            <span className="game-number">{this.props.game.name}</span>
            <span className="game-matchup caps">{this.props.home.name} vs {this.props.away.name}</span>
            <span className="player-requirements">{this.props.playerCount} Players Inside</span>
          </div>
          <div className="game-countries">
            <Country country={this.props.home} />
            <span className="game-vs">vs</span>
            <Country country={this.props.away} />
          </div>
        </a>
      </div>
    );
  }
}
