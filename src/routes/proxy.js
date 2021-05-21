const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
	if (req.query.q) {
		try {
			axios.get(req.query.q, {
				responseType: 'stream'
			}).then((stream) => {
				if (stream.headers['content-type'].includes('image') === false) return res.sendStatus(400);
				if (Number(stream.headers['content-length']) > 26214400) return res.sendStatus(400);
				res.writeHead(stream.status, stream.headers);
				stream.data.pipe(res);
			}).catch(e => {
				return res.sendStatus(500);
			});
		} catch (e) {
			return res.sendStatus(500);
		}
	} else {
		return res.redirect('/');
	}
});

module.exports = router;