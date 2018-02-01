import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import PlayerBlock from './PlayerBlock';

export default class PlayerColumn extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Col xs="2"><PlayerBlock name={this.props.name} /></Col>
    );
  }
}
