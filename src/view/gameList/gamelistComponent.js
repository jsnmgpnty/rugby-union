import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';

import './gameList.css';

class GameListComponent extends Component {
    render(){
        return (
			<Row className="game-list">
				<Col xs="5" className="game-label"><label>GAME 1 </label><h6>FRANCE VS ENGLAND</h6></Col>
				<Col xs="7" className="text-center game-btns">
					<Button color="primary" size="md" className="view-btn">VIEW</Button>{' '}
					<Button color="success" size="md" className="join-btn">JOIN</Button>
				</Col>
				<Col xs="5" className="game-label"><label>GAME 1 </label><h6>FRANCE VS ENGLAND</h6></Col>
				<Col xs="7" className="text-center game-btns">
					<Button color="primary" size="md" className="view-btn">VIEW</Button>{' '}
					<Button color="success" size="md" className="join-btn">JOIN</Button>
				</Col>
				<Col xs="5" className="game-label"><label>GAME 1 </label><h6>FRANCE VS ENGLAND</h6></Col>
				<Col xs="7" className="text-center game-btns">
					<Button color="primary" size="md" className="view-btn">VIEW</Button>{' '}
					<Button color="success" size="md" className="join-btn">JOIN</Button>
				</Col>
			</Row>
		);
    }
}

export default GameListComponent