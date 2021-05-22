const express = require('express');
const google = require('google-it');
const axios = require('axios');
const gis = require('g-i-s');

const router = express.Router();

router.get('/', (req, res) => {
	if (req.query.q) {
		if (req.query.q.startsWith('!')) {
			axios.get(`https://api.duckduckgo.com/?q=${req.query.q}&format=json&no_redirect=1`).then((a) => {
				if (a.data.Redirect) {
					return res.redirect(a.data.Redirect);
				} else {
					google({ 'query': req.query.q, disableConsole: true }).then(r => {
						return res.render('search.ejs', { results: r, query: req.query.q });
					}).catch((e) => {
						res.sendStatus(500);
						return console.error(e);
					});
				}
			}).catch((e) => {
				res.sendStatus(500);
				return console.error(e);
			});
		} else {
			google({ 'query': req.query.q, disableConsole: true }).then(r => {
				return res.render('search.ejs', { results: r, query: req.query.q });
			}).catch((e) => {
				res.sendStatus(500);
				return console.error(e);
			});
		}
	} else {
		return res.redirect('/');
	}
});

router.get('/images', (req, res) => {
	if (req.query.q) {
		try {
			gis(req.query.q, (err, data) => {
				if (err) {
					res.sendStatus(500);
					return console.error(err);
				}
				return res.render('images.ejs', { results: data, query: req.query.q });
			});
		} catch (e) {
			res.sendStatus(500);
			return console.error(e);
		}
	} else {
		return res.redirect('/');
	}
});

module.exports = router;