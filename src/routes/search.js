const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		if (req.query.q.startsWith('!')) {
			axios.get(`https://api.duckduckgo.com/?q=${req.query.q}&format=json&no_redirect=1`).then((a) => {
				if (a.data.Redirect) {
					return res.redirect(a.data.Redirect);
				} else {
					return res.render('search.ejs', { query: req.query.q });
				}
			}).catch((e) => {
				res.sendStatus(500);
				return console.error(e);
			});
		} else {
			return res.render('search.ejs', { query: req.query.q });
		}
	} else {
		return res.redirect('/');
	}
});

router.get('/images', (req, res) => {
	if (req.query.q) {
		try {
			return res.render('images.ejs', { query: req.query.q });
		} catch (e) {
			res.sendStatus(500);
			return console.error(e);
		}
	} else {
		return res.redirect('/');
	}
});

module.exports = router;