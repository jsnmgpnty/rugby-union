import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Country } from 'components';
import './TeamCoin.scss';

export default class TeamCoin extends Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    country: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps) {
     return false;
  }

  render() {
    const { team, country } = this.props;

    return (
      <div className="team-coin">
        <div className={`team-coin__country ${team.isBallHandler ? 'attacking' : 'defending'}`}>
          <Country country={country} />
        </div>
      </div>
    );
  }
}
