const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		if (req.query.q.startsWith('!')) return res.json(["", []]);
		axios.get('https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=' + encodeURIComponent(req.query.q)).then((a) => {
			try {
				var a = a.data.replace('<?xml version="1.0"?>', '').replace('<toplevel>', '[').replace('</toplevel>', ']').replace(/<CompleteSuggestion><suggestion data=/g, "").replace(/[/]><[/]CompleteSuggestion>/g, ', ').replace(', ]', ']');
				return res.json([req.query.q, JSON.parse(a)]);
			} catch (e) {
				res.sendStatus(500);
				return console.error(e);
			}
		}).catch((e) => {
			res.sendStatus(500);
			return console.error(e);
		});
	} else {
		return res.sendStatus(401);
	}
});

module.exports = router;