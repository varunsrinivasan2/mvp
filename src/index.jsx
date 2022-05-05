import React, { useState, useEffect } from "react";
import reactDOM from "react-dom";
import axios from 'axios';
import FlightEntry from './components/FlightEntry.jsx';
import Map from './components/Map.jsx';
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));

const App = () => {
  // const [flight, setFlight] = useState('');
  // const [gateTimeArrival, setGateTimeArrival] = useState('');

  // const

  return (
    <>
      <h1>When should you leave to pick someone up from the aiport?</h1>
      <h2>Colin is the man</h2>
      <FlightEntry/>
      <Map/>
    </>
  )
}

root.render(<App />);