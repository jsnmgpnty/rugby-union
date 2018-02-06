import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert, Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import './Join.css';
import { setUser } from 'actions/user';
import { onUserCreate, onUserCreated } from 'services/SocketClient.js'
import { Spinner } from 'components';

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
});

class Join extends Component {
	static propTypes = {
		setUser: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			isLoading: false,
			isSuccessSignIn: false,
			isCreatingGame: false,
			errorMessage: null,
		};
	}

	componentDidMount() {
		onUserCreated(this.handleUserCreated);
	}

	handleUserCreated = (data) => {
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
	};

	handleNameChange = (event) => {
		this.setState({ username: event.target.value });
	}

	signInUser = (isCreatingGame) => {
		const { username } = this.state;
		this.setState({ isLoading: true, username, isCreatingGame }, onUserCreate(username));
	}

	render() {
		const {
			isLoading,
			isSuccessSignIn,
			errorMessage,
			isCreatingGame,
		} = this.state;

		return (
			<Row>
				<Col md="12" className="join-view">
					<Spinner isLoading={isLoading}>
						<div className="join-view__hero" />
						<div className="join-view__title">
							<h2>Six Nations</h2>
							<h4>Touchdown</h4>
						</div>
						<Form>
							{
								errorMessage && <Alert color="danger">{errorMessage}</Alert>
							}
							<FormGroup>
								<Input type="text" name="name" id="name" placeholder="TYPE YOUR NAME HERE" onChange={this.handleNameChange} />
							</FormGroup>
							<Button
								color="success"
								onClick={(e) => this.signInUser(false)}>
								<i className="" />SELECT A GAME
							</Button>
							<Button
								color="success"
								onClick={(e) => this.signInUser(true)}>
								SELECT A GAME
							</Button>
							{
								isSuccessSignIn && isCreatingGame && <Redirect to="/create" />
							}
							{
								isSuccessSignIn && !isCreatingGame && <Redirect to="/" />
							}
						</Form>
					</Spinner>
				</Col>
			</Row>
		);
	}
}

export default withRouter(connect(null, mapDispatchToProps)(Join));
export { Join as PlainJoin };
