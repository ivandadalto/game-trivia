import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class Ranking extends React.Component {
  btnGoHome = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    const rankingLocal = JSON.parse(localStorage.getItem('ranking'));
    const sortedRankingLocal = rankingLocal.sort((a, b) => b.score - a.score);
    return (
      <div className="ranking-container">
        <h1 className="ranking-title" data-testid="ranking-title">Hall of Fame 亗</h1>
        { rankingLocal !== undefined ? (
          sortedRankingLocal.map((player, index) => (
            <div className="ranking-card" key={ index }>
              <div className="ranking-profile">
                <img className="header-photo" src={ `https://www.gravatar.com/avatar/${player.gravatarEmail}` } alt="imagemGravatar" />
                <p data-testid={ `player-name-${index}` }>
                  Player:
                  {' '}
                  {player.name.toUpperCase()}
                </p>
              </div>
              <p data-testid={ `player-score-${index}` }>
                Total score:
                {' '}
                {player.score}
              </p>
            </div>
          ))
        ) : null}
        <div className="button-container">
          <button
            className="btn btn-dark"
            type="button"
            data-testid="btn-go-home"
            onClick={ this.btnGoHome }
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }
}
Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Ranking);
