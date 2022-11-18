import React from 'react';
import PropTypes from 'prop-types';

class Timer extends React.Component {
  render() {
    const { timer } = this.props;
    return (
      <div className="timer-container">
        <h1 className="timer">
          { timer }
        </h1>
      </div>
    );
  }
}

Timer.propTypes = {
  timer: PropTypes.number.isRequired,
};
export default Timer;
