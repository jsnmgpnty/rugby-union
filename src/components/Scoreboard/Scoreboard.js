import React, { PureComponent } from 'react';
import { Country } from 'components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './Scoreboard.scss';
import PropTypes from 'prop-types';

const mapStateToProps = (state) => ({
  countries: state.countries.countries,
})

class Scoreboard extends PureComponent {
  static propTypes = {
    isTackled: PropTypes.bool.isRequired,
    turnNumber: PropTypes.number.isRequired,
    roundNumber: PropTypes.number.isRequired,
    gameScore: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    teams: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };

  getCountry = (team) => {
    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);
    return country || { name: 'N/A' };
  }

  getResultField = () => {
    const { turnNumber, isTackled } = this.props;
    if (turnNumber === 1) {
      return "default";
    }

    let scoreFieldClassName = isTackled ? "tackled" : "safe";
    scoreFieldClassName += turnNumber;

    return scoreFieldClassName;
  }

  render() {
    const { teams } = this.props;

    return (
      <div>
        <div className="score-view__header">
          <Country country={this.getCountry(teams[0])} />
          <span className="scoreTally">00:00</span>
          <Country country={this.getCountry(teams[1])} />
        </div>
        <div className={`score-view__field ${this.getResultField()}`} />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Scoreboard));