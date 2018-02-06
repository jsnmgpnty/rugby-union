import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Form, Col, Row, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './GameCreate.css';

const mapStateToProps = state => ({
  countries: state.countries,
  user: state.user,
});

class GameCreate extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
		  firstCountrySelected: '',
		  secondCountrySelected: '',
		};
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

export default withRouter(connect(mapStateToProps, null)(GameCreate));
