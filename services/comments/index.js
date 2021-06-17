const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	const postId = req.params.id;
	res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const postId = req.params.id;
	const { content } = req.body;

	const comments = commentsByPostId[postId] || [];

	comments.push({
		id,
		content,
		status: 'pending',
	});

	commentsByPostId[postId] = comments;

	await axios
		.post('http://event-bus-srv:4004/events', {
			type: 'CommentCreated',
			data: {
				id,
				content,
				postId,
				status: 'pending',
			},
		})
		.catch((err) => {
			console.log('errddkjb', err);
		});

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
	const { type, data } = req.body;
	console.log('Received event: ', type);

	if (type === 'CommentModerated') {
		const { postId, id, status, content } = data;

		const comments = commentsByPostId[postId];

		const comment = comments.find((c) => c.id === id);

		comment.status = status;

		await axios.post('http://event-bus-srv:4004/events', {
			type: 'CommentUpdated',
			data: {
				...comment,
				postId,
			},
		});
	}

	res.send({});
});

app.listen(4001, () => {
	console.log('Listening on 4001');
});
