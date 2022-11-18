import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Header from '../componentes/Header';
import Timer from '../componentes/Timer';
import { actionScore, resetScore,
  saveAcertion,
  saveQuestions } from '../redux/actions/indexAction';
import { getQuestions } from '../services';
import './play.css';

const THREE = 3;
const ONE_SECOND = 1000;
const soma10 = 10;
const hard = 3;
const medium = 2;
const easy = 1;
const middle = 0.5;

class Game extends React.Component {
  state = {
    answerColor: false,
    timer: 30,
    buttonDisabled: false,
    indexPergunta: 0,
    indexQ: 0,
    array: [],
    enableNext: false,
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const questions = await getQuestions(token);
    console.log(questions);
    if (questions.response_code === THREE) {
      localStorage.clear();
      const { history } = this.props;
      history.push('/');
    }
    const { dispatch } = this.props;
    await dispatch(saveQuestions(questions));

    this.randomAnswer();
    this.timer();
    dispatch(resetScore());
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.timer === 1) {
      clearInterval(this.intervalID);
      this.setState({
        buttonDisabled: true,
        enableNext: true,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    console.log('Timer Desmontado');
  }

  timer = () => {
    this.intervalID = setInterval(() => {
      this.setState((prev) => ({
        timer: prev.timer > 0 ? prev.timer - 1 : 0,
      }));
    }, ONE_SECOND);
  };

  randomAnswer = () => {
    const { indexQ } = this.state;
    const { questions: { results } } = this.props;
    if (results !== undefined && results.length > 0) {
      console.log(results);
      const incorrectAnswers = results[indexQ].incorrect_answers;
      const correctAnswer = results[indexQ].correct_answer;
      const arrayOfAnswer = [...incorrectAnswers, correctAnswer];
      const sortedArray = arrayOfAnswer.sort(() => Math.random() - middle);
      this.setState({
        array: sortedArray });
    }
  };

  handleColor = (answer) => {
    const { answerColor, indexQ } = this.state;
    const { questions } = this.props;
    if (answerColor) {
      return answer === questions.results[indexQ].correct_answer ? 'btn btn-success'
        : 'btn btn-danger';
    }
    return 'btn btn-dark';
  };

  handleClick = ({ target }) => {
    this.setState({
      answerColor: true,
    });
    const { results, dispatch } = this.props;

    const { indexPergunta } = this.state;
    const { value } = target;
    this.setState({
      buttonDisabled: true,
    });
    clearInterval(this.intervalID);
    if (results[indexPergunta].correct_answer === value) {
      const { timer } = this.state;
      const { difficulty } = results[indexPergunta];
      let pontuacao = 0;
      if (difficulty === 'hard') {
        pontuacao = soma10 + (hard * timer);
        dispatch(actionScore(pontuacao));
        dispatch(saveAcertion());
      } else if (difficulty === 'medium') {
        pontuacao = soma10 + (medium * timer);
        dispatch(actionScore(pontuacao));
        dispatch(saveAcertion());
      } else {
        pontuacao = soma10 + (easy * timer);
        dispatch(actionScore(pontuacao));
        dispatch(saveAcertion());
      }
    }
  };

  handleClickNext = () => {
    const { indexQ } = this.state;
    const { history } = this.props;
    const four = 4;
    if (indexQ === four) {
      history.push('/feedback');
    }
    this.setState((prev) => ({
      indexQ: prev.indexQ + 1,
      answerColor: false,
      indexPergunta: prev.indexPergunta + 1,
      timer: 30,
      buttonDisabled: false,
      enableNext: false,
    }), this.randomAnswer);
    this.timer();
  };

  render() {
    const { timer, buttonDisabled, answerColor, indexQ, array, enableNext } = this.state;
    const { questions } = this.props;
    const nextButton = enableNext || answerColor;
    return (
      <div>
        <Header />
        <Timer timer={ timer } />
        <div className="question-container">
          {
            questions.length !== 0
              ? questions.results.filter((_e, i) => i === indexQ)
                .map((question) => (
                  <div
                    className="question"
                    key={ question.question }
                  >
                    <p data-testid="question-category">
                      Category:
                      {' '}
                      {question.category}
                    </p>
                    <p
                      className="question-text"
                      data-testid="question-text"
                    >
                      {question.question}

                    </p>
                    <div data-testid="answer-options">
                      {array.map((answer, index) => (
                        <div className="button-game" key={ answer }>
                          <button
                            className={ this.handleColor(answer) }
                            data-testid={ answer === question.correct_answer
                              ? 'correct-answer'
                              : `wrong-answer-${index}` }
                            type="button"
                            onClick={ this.handleClick }
                            value={ answer }
                            disabled={ buttonDisabled }
                          >
                            {answer}
                          </button>
                        </div>
                      ))}
                      {
                        (nextButton && event.target.value === question.correct_answer)
                          ? <p className="correct-answer">Correct!</p> : null
                      }
                      {(nextButton && question.incorrect_answers
                        .some((e) => e === event.target.value))
                        ? <p className="incorrect">Incorrect!</p> : null}
                      {(nextButton && timer === 0)
                        ? <p className="timeup">{'Time\'s UP!'}</p> : null}
                      { nextButton && (
                        <button
                          className="btn btn-dark"
                          data-testid="btn-next"
                          type="button"
                          onClick={ this.handleClickNext }
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )) : null
          }

        </div>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  questions: PropTypes.objectOf().isRequired,
  results: PropTypes.arrayOf(Object).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  questions: store.game.questions,
  results: store.game.questions.results,
});
export default connect(mapStateToProps)(Game);
