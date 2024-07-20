const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

process.on('uncaughtException', function (err) {
  console.log(err);
});

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);
  // posts service
  axios.post('http://posts-clusterip-srv:4000/events', event).catch(err => {
    console.log(err.message);
  });
  // comments service
  axios.post('http://comments-srv:4001/events', event).catch(err => {
    console.log(err.message);
  });
  // query service
  axios.post('http://query-srv:4002/events', event).catch(err => {
    console.log(err.message);
  });
  // moderation service
  axios.post('http://moderation-srv:4003/events', event).catch(err => {
    console.log(err.message);
  });
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
