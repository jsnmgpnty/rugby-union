import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';

import './home.css';

class Home extends Component {
    render(){
        return (
			<Row>
				<Col md="12" className="join-form">
					<Form>
						<FormGroup>
						  <Input type="text" name="name" id="name" placeholder="OPTIONAL" />
						</FormGroup>
						<Link to="/list">
							<Button color="success">Join Game</Button>
						</Link>
					</Form>
				</Col>
			</Row>
		);
    }
}

export default Home