import React, { useState, useEffect } from 'react';
import axios from 'axios';


const FlightEntry = () => {
  const [flightInfo, setFlightInfo] = useState('');
  const [capital, setCapital] = useState('');
  const [gateArrival, setGateArrival] = useState(null);
  const [until, setUntil] = useState(null);
  const [timeAtGate, setTimeAtGate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGateArrival(null);
    setUntil(null);
    setTimeAtGate(null);
    console.log(flightInfo)
    var capitalized = '';
    for (let i = 0; i < flightInfo.length; i++) {
      capitalized = capitalized + flightInfo[i].toUpperCase();
    }
    console.log(capitalized);
    setCapital(capitalized);
    let gateTime;
    axios.get(`/flight/${capitalized}`)
      .then(res => {
        console.log(res.data)
        if (typeof res.data === 'number') {
          let minutes = Math.floor(res.data / 1000 / 60);
          if (minutes >= 60) {
            let hours = Math.floor(minutes / 60);
            let remainingMins = minutes % 60;
            hours > 1 ? setTimeAtGate(`${hours} hours and ${remainingMins} minutes ago`) : setTimeAtGate(`${hours} hour and ${remainingMins} minutes ago`);
          } else {
            minutes > 1 ? setTimeAtGate(`${minutes} minutes ago`) : setTimeAtGate(`${minutes} minute ago`);
          }
        } else {
          let estdGateArrival = new Date(res.data);
          setGateArrival(estdGateArrival.toLocaleString('en-US'));
          let minutes = Math.floor((estdGateArrival - new Date()) / 1000 / 60);
          if (minutes >= 60) {
            let hours = Math.floor(minutes / 60);
            let remainingMins = minutes % 60;
            hours > 1 ? setUntil(`${hours} hours and ${remainingMins} minutes`) : setUntil(`${hours} hour and ${remainingMins} minutes`);
          } else {
            setUntil(`${minutes} minutes`);
          }
        }
      })
    setFlightInfo('');
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <label>Flight Number</label>
      <input type="text" placeholder="e.g. 'UAL123'" value={flightInfo} onChange={e => setFlightInfo(e.target.value)}/>
      <input type="submit"/>
    </form>
    {gateArrival && until && <div>Flight {capital} will arrive at {gateArrival} or in {until}.</div>}
    {timeAtGate && <div>Flight {capital} arrived at the gate {timeAtGate}.</div>}
    </>
  )
}

export default FlightEntry;