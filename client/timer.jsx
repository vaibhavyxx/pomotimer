import React, { useEffect, useState } from 'react';
import {useTime, useTimer} from 'react-timer-hook';
import { handleTodo } from './todo.jsx';
import {useSound} from 'use-sound';

//loads time from the server if the user has changed its settings
const useLoadTime = () => {
  const [timeValue, setTimeValue] = useState(null); //default

  useEffect(() => {
    const loadTime = async () => {
      const response = await fetch('/getTime');
      const data = await response.json();
      console.log(data);
      if (data.time.length > 0) {
        setTimeValue(data.time[0].time * 60);
      } else{
        setTimeValue(25 * 60);
      }
    };
    loadTime();
  }, []);
  return {timeValue, setTimeValue};
}

//Takes in the new duration value and returns a time object
const newTime = (period) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + period);
  return time;
}

function MyTimer({ expiryTimestamp, period }) {
  const [play] = useSound('/assets/sounds/beep.mp3');
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, autoStart:false, 
    onExpire: () =>{
      play();
    }});

   const handleDurationChange = (newDuration) => {
        restart(newTime(newDuration), false); 
    };

    let timeString =  `${String(minutes)}:${String(seconds).padStart(2,'0')}`;

    useEffect(() => {
      document.title = `${timeString} - Pomodoro Timer`;
    }, [minutes, seconds]);

  return (
    <div>
      <h1>{timeString}</h1>
      <button onClick={()=> {
        if(isRunning) pause();
        else resume();
      }}>{isRunning? 'Pause':'Play'}</button>
      <button onClick={()=>{
        restart(newTime(period), true);
      }}> Restart</button>
      <ClockSetting onDurationChange={handleDurationChange}/>
    </div>
  );
}

const ClockSetting = ({onDurationChange, props}) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const dur = e.target.querySelector('#duration').value;
    console.log(dur);
    if(!dur) return;

    //TODO: Replace it with helper function
    fetch('/setDuration', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({time: dur}),
    });
    onDurationChange(Number(dur)* 60);  //converts to seconds
  };

    return (
        <form id='clockForm'
            onSubmit={handleSubmit}
            name='clockForm'
            method='PATCH'
            className='clockForm'>
                <label htmlFor='duration'>Duration: </label>
                <input id='duration' type='input' min={1} name='duration' placeholder='Duration'/>
                <input className='submitClock' type='submit' value='Submit' />
            </form>
    );
};

export function Clock(props) {
  const {timeValue, setTimeValue} = useLoadTime();
  if(!timeValue) return <div>Loading...</div>;

  const time = new Date();
  time.setSeconds(time.getSeconds() + timeValue);  //sets value here 
  const t = timeValue;
  return (
    <div>
      <MyTimer expiryTimestamp={time} period={timeValue}  />
    </div>
  );
}