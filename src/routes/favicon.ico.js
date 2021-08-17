const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname + '/../../assets/img/crawlers_round.png'));
});

router.get('/crawlers', (req, res) => {
	return res.sendFile(path.join(__dirname + '/../../assets/img/crawlers.png'));
});

module.exports = router;