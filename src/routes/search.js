const express = require('express');
const google = require('google-it');

const router = express.Router();

router.get('/', (req, res) => {
	console.log(req.query.q)
	if (req.query.q) {
		google({ 'query': req.query.q, disableConsole: true }).then(r => {
			return res.render('search.ejs', { results: r, query: req.query.q });
		}).catch((e) => {
			return console.error(e);
		});
	} else {
		return res.redirect('/')
	}
});

module.exports = router;