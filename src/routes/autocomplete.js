const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		axios.get('https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=' + req.query.q).then((a) => {
			var a = a.data.replace('<?xml version="1.0"?>', '').replace('<toplevel>', '[').replace('</toplevel>', ']').replace(/<CompleteSuggestion><suggestion data=/g, "").replace(/[/]><[/]CompleteSuggestion>/g, ', ').replace(', ]', ']')
			return res.json([req.query.q, JSON.parse(a)])
		}).catch((e) => {
			console.log(e)
		});
	} else {
		return res.sendStatus(401);
	}
});

module.exports = router;