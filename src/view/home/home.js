import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';

import './Home.css';
import { onUserCreate } from 'services/socketClient.js'

class Home extends Component {
	constructor(props){
		super(props);
		this.state = {
			username: "",
		};
	}

	handleNameChange = (event) => {
		this.setState({value: event.target.value});
	}

  render(){
        return (
			<Row>
				<Col md="12" className="join-form">
					<Form>
						<FormGroup>
						  <Input type="text" name="name" id="name" placeholder="TYPE YOUR NAME HERE" onChange={this.handleNameChange} />
						</FormGroup>
						<Link to="/list">
							<Button 
								color="success"
								onClick={() => onUserCreate(this.state.username)}>SELECT A GAME</Button>
						</Link>
					</Form>
				</Col>
			</Row>
		);
    }
}

export default Home