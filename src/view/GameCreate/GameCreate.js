import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';

import pageNames from 'lib/pageNames';
import { setCurrentPage, isTeamsSelectedOnGameCreate, resetNavRedirects } from 'actions/navigation';
import { setTeams, setGameName } from 'actions/createGame';
import './GameCreate.scss';

const mapStateToProps = state => ({
  countries: state.countries.countries,
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  setGameName: (name) => dispatch(setGameName(name)),
  setTeams: (teams) => dispatch(setTeams(teams)),
  setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameCreate)),
  resetNavRedirects: () => dispatch(resetNavRedirects()),
  isTeamsSelectedOnGameCreate: (isSelected) => dispatch(isTeamsSelectedOnGameCreate(isSelected)),
});

class GameCreate extends Component {
  static propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.addNewRow = this.addNewRow.bind(this);
    this.state = {
      rules: [],
      name: '',
      isNamePristine: true,
      isNameValid: true,
      errorMessage: null,
    };
  }

  componentDidMount() {
    const {
      setCurrentPage,
      resetNavRedirects,
    } = this.props;

    setCurrentPage();
    resetNavRedirects();
  }

  addNewRow(e) {
    const rules = this.state.rules;

    if (rules.length > 1) {
      rules.shift();
    }

    const updated = rules.slice(0, 2);
    updated.push(e);
    if (updated.length === 2) {
      this.props.setTeams(updated);
      this.props.isTeamsSelectedOnGameCreate(true);
    }

    this.setState({ rules: updated });
  }

  isCountryActive(country) {
    const countriesSelected = this.state.rules;
    if (countriesSelected.indexOf(country.countryId) !== -1) {
      return country.name + '_on';
    }
    else
      return '';
  }

  displayTeamLabal(countryID) {
    const countriesSelected = this.state.rules;

    if (countriesSelected[0] === countryID) {
      return (
        <span>
          Team
        <label> A </label>
        </span>
      )
    }
    if (countriesSelected[1] === countryID) {
      return (
        <span>
          Team
        <label> B </label>
        </span>
      )
    }
    else
      return ' ';
  }

  handleNameChange = (event) => {
    if (!this.state.isNamePristine) {
      this.validateName(event);
    }

    const name = event.target.value;
    if (name.length >= 2) {
      this.setState({ name, isNameValid: true });
    } else {
      this.setState({ name, isNameValid: false });
    }

    this.props.setGameName(name);
  }

  validateName = (event) => {
    if (event.target.value.length < 2) {
      this.setState({ isNameValid: false, errorMessage: 'Invalid name length', isNamePristine: false });
    } else {
      this.setState({ isNameValid: true, errorMessage: null, isNamePristine: false });
    }
  }

  render() {
    const { countries } = this.props;
    const { errorMessage } = this.state;

    return (
      <div>
        <div className="gamecreate-header">
          <Form>
            <FormGroup>
              <Input
                className={errorMessage && 'has-error'}
                type="text"
                name="name"
                id="name"
                placeholder="Create Game"
                onChange={this.handleNameChange}
              />
            </FormGroup>
          </Form>
          <p>Select 2 teams</p>
        </div>
        <div className="teamlist-div">
          {
            countries && countries.length > 0 && countries.map((country) =>
              <div key={country.countryId} className={`team-div ${country.name}_off ${this.isCountryActive(country)}`} onClick={() => this.addNewRow(country.countryId)}>
                <label className="team-name">{country.name}</label>
                <img src={require('../../assets/teams/' + country.name + '_icon.png')} alt={country.name} />
                <div className="team-label">
                  {this.displayTeamLabal(country.countryId)}
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameCreate));
