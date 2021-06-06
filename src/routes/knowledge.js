const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		axios.get(`https://api.duckduckgo.com/?q=${req.query.q}&format=json`).then(a => {
			if (a.data.Abstract) {
				return res.json({
					description: a.data.Abstract,
					source: a.data.AbstractSource,
					url: a.data.AbstractURL,
					heading: a.data.Heading,
					related: a.data.RelatedTopics
				});
			} else if (a.data.Heading) {
				return res.json({
					heading: a.data.Heading,
					source: a.data.AbstractSource,
					url: a.data.AbstractURL,
					related: a.data.RelatedTopics
				});
			} else if (a.data.Answer) {
				return res.json({
					answer: a.data.Answer,
					answer_type: a.data.AnswerType,
					related: a.data.RelatedTopics
				});
			} else {
				return res.sendStatus(404);
			}
		}).catch((e) => {
			res.sendStatus(500);
			return console.error(e);
		});
	} else {
		return res.redirect('/');
	}
});

module.exports = router;