import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash/chunk';
import PlayersRow from './PlayersRow';
import uuid from 'uuid';

export default class Players extends PureComponent {
  state = {
    playersChunks: [],
  };

  static propTypes = {
    players: PropTypes.array.isRequired,
  };

  componentWillMount() {
    this.setState({ playersChunks: this.createPlayersChunks() });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.players !== newProps.players) {
      this.setState({ playersChunks: this.createPlayersChunks(newProps) });
    }
  }

  createPlayersChunks = (props = this.props) => chunk(props.players, 3);

  render() {
    return this.state.playersChunks.map(pc => <PlayersRow key={uuid()} players={pc} />);
  }
}

