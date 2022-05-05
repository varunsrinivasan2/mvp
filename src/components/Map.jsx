import React, { useState, useEffect } from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";

const Map = () => {
  return(
    <Wrapper apiKey={process.env.MAPS_KEY}>
      {/* <MyMapComponent /> */}
    </Wrapper>
  )
}

export default Map;