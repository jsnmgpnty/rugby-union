import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PlayerColumn from './PlayerColumn';
import { Row, Col } from 'reactstrap';
import uuid from 'uuid';

export default class PlayersRow extends PureComponent {
  static propTypes = {
    players: PropTypes.array.isRequired,
  };

  render() {
    const playersColumns = [];
    this.props.players.forEach(p => {
      playersColumns.push(<PlayerColumn key={uuid()} name={p.name} />);
      playersColumns.push(<Col key={uuid()} xs="2" />);
    });

    return (
      <Row className="playersRow">
        <Col xs="1" />
        {playersColumns}
        <Col xs="1" />
      </Row>
    );
  }
}

