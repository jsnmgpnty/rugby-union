import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Form, Col, Row, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './GameCreate.scss';
import pageNames from 'lib/pageNames';
import { setCurrentPage, isCreatingGame } from 'actions/navigation';

const mapStateToProps = state => ({
	countries: state.countries,
	user: state.user,
});

const mapDispatchToProps = dispatch => ({
	setCurrentPage: () => dispatch(setCurrentPage(pageNames.gameCreate)),
	isCreatingGame: () => dispatch(isCreatingGame(true)),
});

class GameCreate extends Component {
	static propTypes = {
		setCurrentPage: PropTypes.func.isRequired,
		isCreatingGame: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			firstCountrySelected: '',
			secondCountrySelected: '',
		};
	}

	componentDidMount () {
		const {
			isCreatingGame,
			setCurrentPage,
		} = this.props;

		isCreatingGame();
		setCurrentPage('GAMECREATE');
	}

	onCountrySelect = (e) => {
		console.log(e.name);
	}

	render() {
		const { countries, user } = this.props;
		const { firstCountrySelected, secondCountrySelected } = this.state;

		return (
			<Form>
				<Row className="createGame-cont">
					<Col md="6">
						<UncontrolledButtonDropdown>
							<DropdownToggle>
								{
									firstCountrySelected
								}
							</DropdownToggle>
							<DropdownMenu>
								{
									countries && countries.length > 0 && countries.map((country) =>
										<DropdownItem onClick={() => this.onCountrySelect(country)} key={country.countryId}>{country.name}</DropdownItem>)
								}
							</DropdownMenu>
						</UncontrolledButtonDropdown>
					</Col>
					<Col md="6">
						<UncontrolledButtonDropdown>
							<DropdownToggle>
								{
									secondCountrySelected
								}
							</DropdownToggle>
							<DropdownMenu>
								{
									countries && countries.length > 0 &&
									countries.map((country) => <DropdownItem key={country.countryId}>{country.name}</DropdownItem>)
								}
							</DropdownMenu>
						</UncontrolledButtonDropdown>
					</Col>
					<Col xs="12">
						<Link to="">
							<Button color="success" className="createGame-btn">Create Game</Button>
						</Link>
					</Col>
				</Row>
			</Form>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameCreate));
