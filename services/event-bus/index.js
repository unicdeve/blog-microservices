const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
	const event = req.body;

	events.push(event);

	axios.post('http://posts-clusterip-srv:4000/events', event);
	axios.post('http://comments-srv:4001/events', event);
	axios.post('http://query-srv:4002/events', event);
	axios.post('http://moderation-srv:4003/events', event);

	res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
	res.send(events);
});

app.listen(4004, () => {
	console.log('Listening on 4004');
});
