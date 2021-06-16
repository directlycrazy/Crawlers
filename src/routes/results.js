const express = require('express');
const google = require('google-it');
const axios = require('axios');
const gis = require('g-i-s');

const router = express.Router();

router.get('/search', (req, res) => {
  if (req.query.q) {
    google({ 'query': req.query.q, disableConsole: true }).then(r => {
      return res.json(r);
    }).catch((e) => {
      res.sendStatus(500);
      return console.error(e);
    });
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
        return res.json(data)
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