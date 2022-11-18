import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends React.Component {
  render() {
    const { name, score, gravatarEmail } = this.props;
    return (
      <div className="App-header">
        <div className="header-profile">
          <img className="header-photo" src={ `https://www.gravatar.com/avatar/${gravatarEmail}` } alt="imagemGravatar" data-testid="header-profile-picture" />
          <p data-testid="header-player-name">
            Player:
            {'  '}
            {(name).toUpperCase()}
          </p>
        </div>
        <p className="header-score" data-testid="header-score">
          TOTAL POINTS:
          {' '}
          {score}
        </p>
      </div>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  name: state.player.name,
  score: state.player.score,
  gravatarEmail: state.player.gravatarEmail,
});

export default connect(mapStateToProps)(Header);
