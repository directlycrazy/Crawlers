const express = require('express');
const axios = require('axios');

const router = express.Router();

var version = '';

router.get('/', (req, res) => {
	if (version) {
		return res.json({ version: version });
	}
	axios.get('https://api.github.com/repos/directlycrazy/Crawlers/commits').then(a => {
		version = a.data[0].sha.slice(0, 7);
		return res.json({ version: a.data[0].sha.slice(0, 7) });
	}).catch(e => {
		return res.sendStatus(500);
	});
});

module.exports = router;