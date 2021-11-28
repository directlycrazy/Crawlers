const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	return res.send({ ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress });
});

module.exports = router;