const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		if (req.query.q.startsWith('!')) return res.json(["", []]);
		axios.get('https://suggestqueries.google.com/complete/search?client=firefox&q=' + encodeURIComponent(req.query.q)).then((a) => {
			return res.json([req.query.q, a.data[1]]);
		}).catch((e) => {
			res.sendStatus(500);
			return console.error(e);
		});
	} else {
		return res.sendStatus(401);
	}
});

module.exports = router;