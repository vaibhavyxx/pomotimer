import React, { useState } from 'react';
import {useTimer} from 'react-timer-hook';
import { handleTodo } from './todo.jsx';

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, autoStart:false, onExpire: () => console.warn('onExpire called') });

   const handleDurationChange = (newDuration) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + newDuration); 
        console.log(newDuration);
        restart(time, false); 
    };

  return (
    <div>
      <h1>Work</h1>
      <div style={{fontSize: '100px'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <button onClick={()=> {
        if(isRunning) pause();
        else resume();
      }}>{isRunning? 'Pause':'Play'}</button>
      <button onClick={()=>{
        const time = new Date;
        //set to 5 minutes at the moment
        time.setSeconds(time.getSeconds()+300);
        restart(time);
      }}> Restart</button>
      <ClockSetting onDurationChange={handleDurationChange}/>
    </div>
  );
}

const ClockSetting = ({onDurationChange}) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const dur = e.target.querySelector('#duration').value;
    console.log('duration: '+ dur);
    if(!dur) return;
    onDurationChange(Number(dur)* 60);  //converts to seconds

  };
    return (
        <form id='clockForm'
            onSubmit={(e) => handleTodo(e, props.triggerReload)}
            name='clockForm'
            action='/postDuration'
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
  time.setSeconds(time.getSeconds() + 600); 
  return (
    <div>
      <MyTimer expiryTimestamp={time} />
    </div>
  );
}