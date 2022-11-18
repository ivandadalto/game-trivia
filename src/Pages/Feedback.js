import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Header from '../componentes/Header';

const acertos = 3;

class Feedback extends React.Component {
  componentDidMount() {
    const { player } = this.props;
    const rankingLocal = JSON.parse(localStorage.getItem('ranking'));
    if (rankingLocal !== null) {
      localStorage
        .setItem('ranking', JSON.stringify([...rankingLocal, player]));
    } else { localStorage.setItem('ranking', JSON.stringify([player])); }
  }

  sendToLogin = () => {
    const { history } = this.props;
    history.push('/');
  };

  sendToRanking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { assertions, score } = this.props;
    return (
      <>
        <Header />
        <div className="feedback-container">
          <div className="feedback-card">
            <h1 data-testid="feedback-text">Feedback</h1>
            <p data-testid="feedback-total-score" className="feedback-text">
              Total Points:
              {' '}
              {score}
            </p>
            <p data-testid="feedback-total-question" className="feedback-text">
              Assertions:
              {' '}
              {assertions}
            </p>
            {assertions < acertos ? (
              <p
                data-testid="feedback-text"
                className="feedback-yellow"
              >
                Could be better...

              </p>
            )
              : (
                <p
                  data-testid="feedback-text"
                  className="feedback-green"
                >
                  Well Done!

                </p>)}
            <button
              className="btn btn-dark"
              data-testid="btn-play-again"
              type="button"
              onClick={ this.sendToLogin }
            >
              Play Again
            </button>
            <button
              className="btn btn-dark"
              data-testid="btn-ranking"
              type="button"
              onClick={ this.sendToRanking }
            >
              Ranking
            </button>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (store) => ({
  assertions: store.player.assertions,
  score: store.player.score,
  player: store.player,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  player: PropTypes.shape({
    name: PropTypes.string,
    assertions: PropTypes.number,
    score: PropTypes.number,
    gravatarEmail: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps)(Feedback);
