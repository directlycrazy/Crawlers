const express = require('express');
const google = require('google-it');
const axios = require('axios');
const gis = require('g-i-s');
const googleNewsScraper = require('google-news-scraper');
const fs = require('fs');

const router = express.Router();

//GENERATE BANGS (uncomment below if you want to update the file on startup)

/*var b = '{';

axios.get('https://duckduckgo.com/bang.v255.js').then(c => {
	var length = c.data.length;
	Object.values(c.data).forEach((a, i) => {
		if (a.u !== '') {
			b += `"${a.t}" : "${a.u}", `;
		} else {
			length = length - 1;
		}
		if (i + 1 === length) {
			b += '}';
			fs.writeFile('bangs.json', b, () => {
				return;
			});
		}
	});
});*/

fs.readFile('bangs.json', (err, data) => {
	if (err) return console.error(err);
	var bangs = JSON.parse(data);
	router.get('/', (req, res) => {
		if (req.query.q) {
			if (req.query.q.startsWith('!')) {
				if (bangs[req.query.q.slice(1).split(' ')[0]]) {
					return res.redirect(bangs[req.query.q.split(' ')[0].slice(1)].replace('{{{s}}}', req.query.q.replace(req.query.q.split(' ')[0] + ' ', "")));
				}
			}
			google({ 'query': req.query.q, disableConsole: true }).then(r => {
				return res.render('search.ejs', { results: r, query: req.query.q });
			}).catch((e) => {
				return console.error(e);
			});
		} else {
			return res.redirect('/');
		}
	});
});

router.get('/images', (req, res) => {
	if (req.query.q) {
		gis(req.query.q, (err, data) => {
			if (err) return console.log(err);
			return res.render('images.ejs', { results: data, query: req.query.q });
		});
	} else {
		return res.redirect('.');
	}
});

module.exports = router;