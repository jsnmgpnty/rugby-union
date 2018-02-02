import React, { Component } from 'react';

import GameListComponent from './GameListComponent';
import GameCreateComponent from './GameCreateComponent';

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