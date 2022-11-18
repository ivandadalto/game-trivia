import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { actionEmail, actionNome } from '../redux/actions/indexAction';
import getToken from '../services';
import logo from '../trivia.png';

const INITIAL_STATE = {
  name: '',
  email: '',
  buttonPlay: true,
};
class Login extends React.Component {
  state = INITIAL_STATE;

  validateForm = () => {
    const { name, email } = this.state;
    const regex = /\S+@\S+\.\S+/;

    if (regex.test(email) && name.length > 0) {
      this.setState({ buttonPlay: false });
    } else {
      this.setState({ buttonPlay: true });
    }
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    }, this.validateForm);
  };

  entrar = async () => {
    const { history, dispatch } = this.props;
    const { email, name } = this.state;
    const response = await getToken();
    localStorage.setItem('token', response.token);
    const emailGravatar = md5(email).toString();
    dispatch((actionNome(name)));
    dispatch(actionEmail(emailGravatar));
    if (response.token) {
      history.push('/play');
    }
  };

  configButton = () => {
    const { history } = this.props;
    history.push('/configuracoes');
  };

  render() {
    const { buttonPlay, name, email } = this.state;
    return (
      <div className="Loggin-page">
        <img src={ logo } className="App-logo" alt="App-logo" />
        <div className="Loggin-container">
          <h1 className="tittle">Login</h1>
          <div className="loggin-inputs">
            <label htmlFor="nome">
              NAME
              <input
                className="input-group-text"
                type="text"
                id="nome"
                name="name"
                data-testid="input-player-name"
                onChange={ this.handleChange }
                value={ name }
              />

            </label>

            <label htmlFor="email" style={ {} }>
              EMAIL
              <input
                type="email"
                id="email"
                name="email"
                data-testid="input-gravatar-email"
                onChange={ this.handleChange }
                value={ email }
                className="input-group-text"
              />

            </label>
          </div>
          <div>
            <button
              className="btn btn-dark"
              type="button"
              data-testid="btn-play"
              disabled={ buttonPlay }
              onClick={ this.entrar }
            >
              Play

            </button>

            <button
              className="btn btn-dark"
              type="button"
              data-testid="btn-settings"
              onClick={ this.configButton }
            >
              Config
            </button>
          </div>
        </div>
      </div>

    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,

  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
