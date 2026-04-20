import React from 'react';
import {useTimer} from 'react-timer-hook';

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, autoStart:false, onExpire: () => console.warn('onExpire called'), interval: 1000 });


  return (
    <div style={{textAlign: 'center'}}>
      <h1>react-timer-hook </h1>
      <p>Timer Demo</p>
      <div style={{fontSize: '100px'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        restart(time)
      }}>Restart</button>

      <ClockSetting />
    </div>
  );
}

const ClockSetting = (props) => {
    return (
        <form id='clockForm'
            onSubmit={(e) => handleTodo(e, props.triggerReload)}
            name='clockForm'
            action='/clockSetting'
            method='POST'
            className='clockForm'>
                <label htmlFor='duration'>Duration: </label>
                <input id='duration' type='input' min={1} name='duration' placeholder='Duration'/>
                <input className='submitClock' type='submit' value='Submit' />
            </form>
    );
};

export function Clock() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // this is what's tailored --TODO
  return (
    <div>
      <MyTimer expiryTimestamp={time} />
    </div>
  );
}