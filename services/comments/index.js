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
	});

	commentsByPostId[postId] = comments;

	await axios
		.post('http://localhost:40004/events', {
			type: 'CommentCreated',
			data: {
				id,
				content,
				postId,
			},
		})
		.catch((err) => {
			console.log(err);
		});

	res.status(201).send(comments);
});

app.listen(4001, () => {
	console.log('Listening on 4001');
});
