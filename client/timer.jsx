import React, { useEffect, useState } from 'react';
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
        restart(time, false); 
    };

    let timeString =  `${String(minutes)}:${String(seconds).padStart(2,'0')}`;

    useEffect(() => {
      document.title = `${timeString} - Pomodoro Timer`;
    }, [minutes, seconds]);

  return (
    <div>
      <div>
        <h1>{timeString}</h1>
      </div>
      <button onClick={()=> {
        if(isRunning) pause();
        else resume();
      }}>{isRunning? 'Pause':'Play'}</button>
      <button onClick={()=>{
        const time = new Date;
        //set to 5 minutes at the moment
        //fetches time here


        time.setSeconds(time.getSeconds()+300);
        restart(time);
      }}> Restart</button>
      <ClockSetting onDurationChange={handleDurationChange}/>
    </div>
  );
}

const ClockSetting = ({onDurationChange, props}) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const dur = e.target.querySelector('#duration').value;
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
  const [timeValue, setTimeValue] = useState(null); //default

  //loads time from the server if changed by the user, else is 25 minutes by default
  useEffect(() => {
    const loadTime = async () => {
      const response = await fetch('/getTime');
      const data = await response.json();
      console.log(data);  //verify
      if (data.time.length > 0) {
        setTimeValue(data.time[0].time * 60);
      } else{
        setTimeValue(25 * 60);
      }

      if(response.status == 204)
        setTimeValue();
    };
    loadTime();
  }, [props.reloadTime]);

  if(!timeValue) return <div>Loading...</div>;

  const time = new Date();
  time.setSeconds(time.getSeconds() + timeValue);  //sets value here 
  
  return (
    <div>
      <MyTimer expiryTimestamp={time} />
    </div>
  );
}