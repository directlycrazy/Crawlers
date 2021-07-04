const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
	if (req.query.q) {
		if (!req.query.q.startsWith('https://encrypted-tbn0.gstatic.com/images?q=tbn:')) return res.sendStatus(400)
		axios.get(req.query.q, {
			responseType: 'stream'
		}).then((stream) => {
			if (stream.headers['content-type'].includes('image') === false) return res.sendStatus(400);
			if (Number(stream.headers['content-length']) > 26214400) return res.sendStatus(400);
			res.writeHead(200);
			return stream.data.pipe(res);
		}).catch(e => {
			return res.sendStatus(500);
		});
	} else {
		return res.redirect('/');
	}
});

module.exports = router;