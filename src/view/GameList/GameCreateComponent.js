import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './GameList.css';

class GameCreateComponent extends Component {

	render() {
		return (
			<Row className="createGame-cont">
				<Col md="6">
					<UncontrolledButtonDropdown>
						<DropdownToggle caret>
							Country
					</DropdownToggle>
						<DropdownMenu>
							<DropdownItem>Country 1</DropdownItem>
							<DropdownItem>Country 2</DropdownItem>
						</DropdownMenu>
					</UncontrolledButtonDropdown>
				</Col>
				<Col md="6">
					<UncontrolledButtonDropdown>
						<DropdownToggle caret>
							Country
					</DropdownToggle>
						<DropdownMenu>
							<DropdownItem>Country 1</DropdownItem>
							<DropdownItem>Country 2</DropdownItem>
						</DropdownMenu>
					</UncontrolledButtonDropdown>
				</Col>
				<Col xs="12">
					<Link to="">
						<Button color="success" className="createGame-btn">Create Game</Button>
					</Link>
				</Col>
			</Row>
		);
	}
}

export default GameCreateComponent;
