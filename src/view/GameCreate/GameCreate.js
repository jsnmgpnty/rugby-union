import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Form, Col, Row, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './GameCreate.scss';
import pageNames from 'lib/pageNames';
import { setCurrentPage, isTeamsSelectedOnGameCreate } from 'actions/navigation';
import { setTeams } from 'actions/createGame';

const mapStateToProps = state => ({
	countries: state.countries.countries,
	user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
	setTeams: (teams) => dispatch(setTeams(teams)),
	setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameCreate)),
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
			rules: []
		}
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
		if (countriesSelected.indexOf(country.countryId) != '-1') {
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

	componentDidMount() {
		const {
			setCurrentPage,
		} = this.props;

		setCurrentPage();
	}

	render() {
		const { countries, user } = this.props;

		return (
			<div>
				<div className="gamecreate-header">
					<h2>Create Game</h2>
					<p>Select 2 teams</p>
				</div>
				<div className="teamlist-div">
					{
						countries && countries.length > 0 && countries.map((country) =>
							<div key={country.countryId} className={`team-div ${country.name}_off ${this.isCountryActive(country)}`} onClick={() => this.addNewRow(country.countryId)}>
								<label className="team-name">{country.name}</label>
								<img src={require('../../assets/teams/' + country.name + '_icon.png')} />
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
