const express = require('express');
const axios = require('axios');
const limiter = require('express-rate-limit');

const scrape = require('../scrape.js');

const rate_limiter = limiter({
  windowMs: 60000,
  max: 15
});

const router = express.Router();

router.use(rate_limiter);

router.get('/search', (req, res) => {
  const a = new scrape(req.query.q);
  if (req.query.q) {
    a.all().then(b => {
      return res.json(b);
    }, () => {
      return res.sendStatus(500);
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/search/pages', (req, res) => {
  const a = new scrape(req.query.q);
  if (req.query.q && req.query.r) {
    if (isNaN(req.query.r)) return res.redirect('/');
    a.duckducksearch(req.query.r).then(b => {
      return res.json(b);
    }, () => {
      return res.sendStatus(500);
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
    }, () => {
      return res.sendStatus(500);
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/weather', (req, res) => {
  const a = new scrape(req.query.q);
  if (req.query.q) {
    a.weather().then(b => {
      return res.json(b);
    }, () => {
      return res.sendStatus(500);
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/knowledge', (req, res) => {
  if (req.query.q) {
    if (req.query.q.toLowerCase().includes('ip') && req.query.q.toLowerCase().includes('my')) return res.sendStatus(404);
    axios.get(`https://api.duckduckgo.com/?q=${req.query.q}&format=json`).then(a => {
      if (a.data.Abstract) {
        return res.json({
          description: a.data.Abstract,
          source: a.data.AbstractSource,
          url: a.data.AbstractURL,
          heading: a.data.Heading,
          related: a.data.RelatedTopics,
          image: a.data.Image
        });
      } else if (a.data.Heading) {
        return res.json({
          heading: a.data.Heading,
          source: a.data.AbstractSource,
          url: a.data.AbstractURL,
          related: a.data.RelatedTopics,
          image: a.data.Image
        });
      } else if (a.data.Answer) {
        return res.json({
          answer: a.data.Answer,
          answer_type: a.data.AnswerType,
          related: a.data.RelatedTopics,
          image: a.data.Image
        });
      } else {
        return res.sendStatus(404);
      }
    }).catch((e) => {
      res.sendStatus(500);
      return console.error(e);
    });
  } else {
    return res.redirect('/');
  }
});

module.exports = router;