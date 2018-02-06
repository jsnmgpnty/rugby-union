import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import GameListComponent from './GameListComponent';

class GameList extends Component {
	render() {
		return (
			<div>
				<GameListComponent />
			</div>
		);
	}
}

export default withRouter(GameList);
