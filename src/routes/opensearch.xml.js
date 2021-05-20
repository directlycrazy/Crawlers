const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.header('content-type', 'text/xml')
	return res.send(`<?xml version="1.0" encoding="utf-8"?>
	<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>Crawlers</ShortName>
  <Description>Crawl Google search results while protecting your privacy.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html"  template="http://${req.headers.host}/search">
    <Param name="q" value="{searchTerms}"/>
  </Url>
  <Url type="application/x-suggestions+json"  template="http://${req.headers.host}/autocomplete">
      <Param name="q" value="{searchTerms}"/>
  </Url>
  <moz:SearchForm>http://${req.headers.host}/search</moz:SearchForm>
	</OpenSearchDescription>`);
});

module.exports = router;