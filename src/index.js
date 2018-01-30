import React from 'react';
import ReactDOM from 'react-dom';

// Import routing components
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import './bootstrap/dist/css/bootstrap.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router>
		<App />
    </Router>,
    document.getElementById('root')
);
registerServiceWorker();
