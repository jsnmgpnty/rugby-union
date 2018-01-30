import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import VoteCount from './VoteCount';

export default class PlayerBlock extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="playerBlock">
        <div className="playerStatus">
          <VoteCount count="5" type="total" />
          <VoteCount count="1" type="user" />
        </div>
        <span className="playerName">{this.props.name}</span>
      </div>
    );
  }
}
