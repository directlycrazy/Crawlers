const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		axios.get(`https://api.duckduckgo.com/?q=${req.query.q}&format=json`).then(a => {
			if (a.data.Abstract) {
				res.json({
					description: a.data.Abstract,
					source: a.data.AbstractSource,
					url: a.data.AbstractURL,
					heading: a.data.Heading
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