const axios = require('axios');
const querystring = require('querystring');
const cheerio = require('cheerio');
const flatten = require('lodash.flatten');

class Scrape {
	constructor(query) {
		this.query = query;
	}
	all() {
		return new Promise(res => {
			//fetch page data
			axios.get('https://www.google.com/search?q=' + this.query, {
				headers: {
					'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0"
				}
			}).then(a => {
				var results = [];

				const $ = cheerio.load(a.data);

				var link_index = 0;

				const link = (a) => {
					if (a) {
						if (a.includes('google.com/aclk')) {
							return a;
						}
						return querystring.parse(a).url;
					} else {
						return false;
					}
				};

				var correct_string = $('#scl').html();

				const snippet = (a) => {
					const data = (child) => {
						if (!child.data) {
							return child.children.map((c) => c.data || data(c));
						}
						return child.data;
					};
					return a.children && a.children.length > 0 ? a.children.map((child) => Array(data(child)).join('')).join('') : '';
				};

				$('div.ZINbbc > div:nth-child(1) > a > h3').contents().each((i, a) => {
					var result_title = a.data ? a.data : a.children[0].data;
					var result_link = $('div.ZINbbc > div:nth-child(1) > a')[link_index].attribs.href;
					var result_snippet = $('#main > div > div > div > div:not(.v9i61e) > div.AP7Wnd')[i];

					if (!(result_link.startsWith('/url?esrc=') || result_link.startsWith('http://www.google.com/url?esrc=') || result_link.startsWith('https://www.google.com/url?esrc='))) {
						link_index++;
						var c = $('div.ZINbbc > div:nth-child(1) > a')[link_index].attribs;
						if (c) {
							return result_link = c.href;
						} else {
							return result_link = null;
						}
					}

					var b = { title: result_title, link: link(result_link), snippet: snippet(result_snippet) };

					if (b.title && b.link && b.snippet) {
						results.push(b);
					}

					link_index++;
				});

				if (correct_string) {
					return res({ correct_string: correct_string, results: results });
				} else {
					return res({ results: results });
				}
			});
		});
	}
	images() {
		return new Promise(res => {
			axios.get('https://www.google.com/search?tbm=isch&q=' + this.query, {
				headers: {
					'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0"
				}
			}).then(a => {
				var $ = cheerio.load(a.data);

				var results = [];

				$('.t0fcAb').contents().prevObject.each((i, a) => {
					if (a.attribs.src) {
						results.push({ url: a.attribs.src });
					}
					return;
				});

				return res(results);
			});
		});
	}
}

module.exports = Scrape;