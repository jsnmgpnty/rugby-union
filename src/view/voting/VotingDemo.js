import React, { PureComponent } from 'react';
import './Voting.css';
import Players from './Players';
import { Container, Row, Col, Button } from 'reactstrap';

export default class Voting extends PureComponent {
  players = [
    { name: 'Mark' },
    { name: 'Kim' },
    { name: 'Mikey' },
    { name: 'Joanne' },
    { name: 'Doy' },
    { name: 'Shiela' },
    { name: 'Tricia' },
    { name: 'Terence' },
    { name: 'Jason' },
    { name: 'Louie' },
  ];

  render() {
    return (
      <Container fluid style={{ height: '100vh' }}>
        <div className="field"></div>
        <Players players={this.players} />
        <Button color="success" size="lg" block>PASS</Button>
      </Container>
    );
  }
}
