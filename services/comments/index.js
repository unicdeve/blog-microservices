const express = require('express');
// const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
// app.use(bodyParser.json());

const comments = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(comments);
});

app.post('/posts/:id//comments', (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { comment } = req.body;

	comments[id] = {
		id,
		comment,
	};

	res.status(201).send(comments[id]);
});

app.listen(4001, () => {
	console.log('Listening on 4000');
});
