import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import './Home.css';
import { setUser } from 'actions/user';
import { onUserCreate, onUserCreated } from 'services/SocketClient.js'
import { Spinner } from 'components';

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
});

class Home extends Component {
	static propTypes = {
		setUser: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			isLoading: false,
			isSuccessSignIn: false,
			errorMessage: null,
		};
	}

	componentDidMount() {
		onUserCreated((data) => {
			if (data.error) {
				this.setState({
					errorMessage: data.error,
					isLoading: false,
					isSuccessSignIn: false,
				});
			} else {
				this.props.setUser(data);
				reactLocalStorage.setObject('user', data);
				this.setState({
					errorMessage: null,
					isLoading: false,
					isSuccessSignIn: true,
				});
			}
		});
	}

	handleNameChange = (event) => {
		this.setState({ username: event.target.value });
	}

	signInUser = () => {
		const { username } = this.state;
		this.setState({ isLoading: true, username }, onUserCreate(username));
	}

	render() {
		const { isLoading, isSuccessSignIn, errorMessage } = this.state;

		return (
			<Row>
				<Col md="12" className="join-form">
					<Spinner isLoading={isLoading}>
						<Form>
							{
								errorMessage && <Alert color="danger">{errorMessage}</Alert>
							}
							<FormGroup>
								<Input type="text" name="name" id="name" placeholder="TYPE YOUR NAME HERE" onChange={this.handleNameChange} />
							</FormGroup>
							<Button
								color="success"
								onClick={(e) => this.signInUser()}>
								SELECT A GAME
							</Button>
							{
								isSuccessSignIn && <Redirect to="/list" />
							}
						</Form>
					</Spinner>
				</Col>
			</Row>
		);
	}
}

export default withRouter(connect(null, mapDispatchToProps)(Home));
export { Home as PlainHome };
