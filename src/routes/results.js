const express = require('express');
const axios = require('axios');

const scrape = require('../scrape.js');

const router = express.Router();

router.get('/search', (req, res) => {
  const a = new scrape(req.query.q);
  if (req.query.q) {
    a.all().then(b => {
      return res.json(b);
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/images', (req, res) => {
  const a = new scrape(req.query.q);
  if (req.query.q) {
    a.images().then(b => {
      return res.json(b);
    });
  } else {
    return res.redirect('/');
  }
});

module.exports = router;