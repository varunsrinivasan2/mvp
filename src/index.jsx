import React, { useState, useEffect } from "react";
import reactDOM from "react-dom";
import axios from 'axios';
import FlightEntry from './components/FlightEntry.jsx';
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));

const App = () => {
  return (
    <>
      <h1>No Wayt!</h1>
      <FlightEntry/>
    </>
  )
}

root.render(<App />);