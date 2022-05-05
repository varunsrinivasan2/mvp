import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import 'regenerator-runtime/runtime'

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef, airport, updateDirections, time) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, airport, updateDirections, time)
  );
}

async function handlePlaceSelect(updateQuery, airport, updateDirections, time) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log(query, airport);
  axios.get('/directions', {
    params: {
      origin: query,
      destination: airport,
      time: time
    }
  })
    .then(res => updateDirections(res.data.routes))
}

function SearchLocationInput({ ap, unix }) {
  const [query, setQuery] = useState('');
  const autoCompleteRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const airport = ap;
  const time = unix;

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, airport, setDirections, time)
    );
  }, []);

  useEffect(() => {
    console.log(directions)
    if (directions) {
      let minutes = Math.round((directions[0].legs[0].duration_in_traffic.value) / 60);
      if (minutes > 60) {
        let hours = Math.floor(hours / 60);
        let remainingMins = minutes % 60;
        hours > 1 ? setTravelTime(`${hours} hours and ${remainingMins} minutes`) : setTravelTime(`${hours} hour and ${remainingMins} minutes`);
      } else {
        setTravelTime(`${minutes} minutes`);
      }
    }
  }, [directions]);

  return (
    <>
    <div className="search-location-input">
      <label>Enter Starting Location</label>
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        value={query}
      />
    </div>
    {directions && travelTime && <div>If you left your current location when the plane pulls into the gate, you will have a travel time of {travelTime} including estimated traffic.</div>}
    </>
  );
}

export default SearchLocationInput;