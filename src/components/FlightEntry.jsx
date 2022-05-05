import React, { useState, useEffect } from 'react';
import SearchLocationInput from './SearchLocationInput.jsx';
import axios from 'axios';


const FlightEntry = () => {
  const [flightInfo, setFlightInfo] = useState('');
  const [capital, setCapital] = useState('');
  const [gateArrival, setGateArrival] = useState(null);
  const [until, setUntil] = useState(null);
  const [timeAtGate, setTimeAtGate] = useState(null);
  const [airport, setAirport] = useState('');
  const [unix, setUnix] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGateArrival(null);
    setUntil(null);
    setTimeAtGate(null);
    setAirport('');
    var capitalized = '';
    for (let i = 0; i < flightInfo.length; i++) {
      capitalized = capitalized + flightInfo[i].toUpperCase();
    }
    setCapital(capitalized);
    let gateTime;
    axios.get(`/flight/${capitalized}`)
      .then(res => {
        console.log(res.data)
        setAirport(res.data.airport)
        if (typeof res.data.gate === 'number') {
          setUnix(res.data.gate);
          let minutes = Math.floor(res.data.gate / 1000 / 60);
          if (minutes >= 60) {
            let hours = Math.floor(minutes / 60);
            let remainingMins = minutes % 60;
            hours > 1 ? setTimeAtGate(`${hours} hours and ${remainingMins} minutes ago`) : setTimeAtGate(`${hours} hour and ${remainingMins} minutes ago`);
          } else {
            minutes > 1 ? setTimeAtGate(`${minutes} minutes ago`) : setTimeAtGate(`${minutes} minute ago`);
          }
        } else {
          setUnix(Date.parse(res.data.gate) / 1000);
          let estdGateArrival = new Date(res.data.gate);
          setGateArrival(estdGateArrival.toLocaleTimeString('en-US'));
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
    {gateArrival && until && <><div>Flight {capital} will arrive at the gate at {airport} in {until} at {gateArrival}.</div><SearchLocationInput ap={airport} unix={unix}/></>}
    {timeAtGate && <><div>Flight {capital} arrived at the gate {timeAtGate}.</div><SearchLocationInput ap={airport} unix={unix}/></>}
    </>
  )
}

export default FlightEntry;