import React, { PureComponent } from 'react';
import './Voting.css';
import PlayerBlock from './PlayerBlock';

export default class Voting extends PureComponent {
  render() {
    return (
      <div>
        <PlayerBlock name="Anthony" />
        <PlayerBlock name="Jason" />
        <PlayerBlock name="Kim" />
        <PlayerBlock name="Louie" />
      </div>
    );
  }
}
