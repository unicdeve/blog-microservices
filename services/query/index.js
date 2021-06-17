const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		console.log(posts);

		posts[postId].comments.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { id, postId, status, content } = data;

		const post = posts[postId];

		const comment = post.comments.find((c) => c.id === id);

		comment.status = status;
		comment.content = content;
	}
};

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	handleEvent(type, data);

	res.send({});
});

app.listen(4002, async () => {
	console.log('Listening on 4002');

	try {
		const res = await axios.get('http://event-bus-srv:4004/events');

		for (let e of res.data) {
			console.log('Proessing event: ', e.type);
			handleEvent(e.type, e.data);
		}
	} catch (err) {
		console.log('err', err);
	}
});
