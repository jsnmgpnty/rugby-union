import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import TeamCoin from './TeamCoin';
import './TeamSpinner.scss';

const mapStateToProps = (state) => ({
  countries: state.countries.countries,
})

class TeamSpinner extends Component {
  static propTypes = {
    teams: PropTypes.array.isRequired,
    currentTeam: PropTypes.string.isRequired,
  }

  state = {
    spinDone: false,
    showTextDone: false,
    activeTab: null,
  }

  componentDidMount() {
    const showText = () => {
      setTimeout(() => {
        this.setState({
          showTextDone: true,
        });
      }, 1000);
    };

    const spinDone = () => {
      setTimeout(() => {
        this.setState({
          spinDone: true,
        }, showText);
      }, 1000);
    };

    this.setState({
      activeTab: this.isUserInAttackingTeam() ? 'attack' : 'defend',
    });

    setTimeout(() => {
      spinDone();
    }, 3500);
  }

  getTextTabs = () => {
    return (
      <div className="team-spinner__content-texts">
        <Nav tabs justified>
          <NavItem>
            <NavLink className={this.isUserInAttackingTeam() ? 'active attack' : null}>
              Attacking Team
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={!this.isUserInAttackingTeam() ? 'active defend' : null}>
              Defending Team
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="attack" className="team-spinner__content-texts-attack">
            <h4>Game Tip!</h4>
            <p>
              To win the round, your team must successfully do a Try by evading 4
              turns without being tackled. Only the ball handler
              can select a player to pass or keep the ball per turn.
          </p>
          </TabPane>
          <TabPane tabId="defend" className="team-spinner__content-texts-defend">
            <h4>Game Tip!</h4>
            <p>
              To win the round, majority of the team must guess the ball handler
              by selecting 1 player from the opposing team and hit tackle. Your team only needs one
              tackle before the opposing team reach the 4th turn and do a Try.
          </p>
          </TabPane>
        </TabContent>
      </div>
    );
  }

  getHeaderText = () => {
    const { spinDone } = this.state;

    if (!spinDone) {
      return 'Randomizing...';
    }

    if (this.isUserInAttackingTeam()) {
      return 'You belong to the attacking team';
    }

    return 'You belong to the defending team';
  }

  getCountry = (team) => {
    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);
    return country || { name: 'N/A' };
  }

  isUserInAttackingTeam = () => {
    const { teams, currentTeam } = this.props;
    const attackingTeam = teams.find(a => a.isBallHandler);

    if (attackingTeam) {
      return attackingTeam.teamId === currentTeam;
    }

    return false;
  }

  render() {
    const { teams } = this.props;
    const { spinDone } = this.state;

    return (
      <div id="team-spinner">
        <div className="team-spinner__header">
          <h2>Round 1</h2>
          <h5>{this.getHeaderText()}</h5>
        </div>
        <div className="team-spinner__content">
          <div className="team-spinner__content-teams">
            <TeamCoin country={this.getCountry(teams[0])} team={teams[0]} />
            <TeamCoin country={this.getCountry(teams[1])} team={teams[1]} />
          </div>
          {
            spinDone && this.getTextTabs()
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(TeamSpinner);
