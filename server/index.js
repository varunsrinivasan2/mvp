const express = require('express');
const path = require('path');
const axios = require('axios');

require('dotenv').config()

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/flight/:flightId', (req,res) => {
  axios.get(`${process.env.FA_URL}/flights/${req.params.flightId}`, { headers: { 'x-apikey': `${process.env.FA_KEY}` } })
    .then(response => {
      let flights = response.data.flights;
      let smallestTimeDifference;
      for (let flight of flights) {
        let flightDate = new Date(flight.estimated_in);
        let local = flightDate.toLocaleString('en-US');
        if ((flight.progress_percent > 0 && flight.progress_percent < 100) || flight.status.includes('En Route')) {
          console.log(flight.ident, '||', flight.status, '||', local)
          console.log(flight)
          return flight.estimated_in;
        } else if (flight.status.includes('Landed')) {
          console.log(flight.ident, '||', flight.status, '||', local)
          return flight.estimated_in;
        } else if (flight.status.includes('Arrived')) {
          console.log(flight.ident, '||', flight.status, '||', local, new Date() - flightDate)
          let current = new Date() - flightDate;
          if (!smallestTimeDifference) {
            smallestTimeDifference = current;
          } else if (current < smallestTimeDifference) {
            smallestTimeDifference = current;
          }
          console.log(smallestTimeDifference)
        }
      }
      if (smallestTimeDifference) {
        return JSON.stringify(smallestTimeDifference);
      }
    })
    .then(result => {
      console.log('result', result)
      res.send(result)
    })
    .catch(err => console.log(err, 'server'))
});

// app.get('/place', (req, res) => {
//   axios.get(`${process.env.MAPS_URL}/place/autocomplete/json?input=${req.body.input}&key=${process.env.MAPS_KEY}`)
//     .then(response => {
//       console.log(response.data)
//       res.send('response')
//     })
// })

// app.get('/directions', (req, res) => {

// })

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});