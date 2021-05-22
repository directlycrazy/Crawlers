const express = require('express');
const fs = require('fs');

const router = express.Router();

router.use('/assets', express.static('assets'));

fs.readdir(__dirname + '/routes', (err, files) => {
	if (err) return console.error(err);
	files.forEach((file, index) => {
		try {
			router.use('/' + file.slice(0, file.length - 3), require(__dirname + '/routes/' + file));
		} catch (e) { console.error(e); }
		if (index + 1 === files.length) {
			router.use(express.static('assets'));
			router.get('/', (req, res) => {
				return res.render('index.ejs');
			});
			router.get('*', (req, res) => {
				return res.sendStatus(404);
			});
		}
	});
});

module.exports = router;