import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Lobby.css';
import LobbyHeader from './LobbyHeader';
import { GameCard } from 'components';

export default class Lobby extends PureComponent {
  static propTypes = {

  };

  render() {
    return (
      <div className="lobby">
        <LobbyHeader />
        <div className="game-list">
          <GameCard number={1} home="England" away="Scotland" playerCount={6} />
          <GameCard number={2} home="England" away="Scotland" playerCount={11} />
        </div>
      </div>
    );
  }
}
