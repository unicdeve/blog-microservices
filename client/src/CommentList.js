import React from 'react';

const CommentList = ({ comments }) => {
	const renderedComments = comments.map(({ id, content, status }) => {
		const finalContent =
			status === 'approved'
				? content
				: status === 'pending'
				? 'This comment is awaiting moderation'
				: status === 'rejected'
				? 'This comment was rejected'
				: null;

		return <li key={id}>{finalContent}</li>;
	});

	return <ul>{renderedComments}</ul>;
};

export default CommentList;
