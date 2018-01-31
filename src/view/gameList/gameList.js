import React, { Component } from 'react';

import GameListComponent from './gamelistComponent';
import GameCreateComponent from './gameCreateComponent';

class GameList extends Component {
    render(){
        return (
			<div>
				<GameListComponent />
				<GameCreateComponent />
			</div>
		);
    }
}

export default GameList