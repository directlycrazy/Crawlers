const axios = require('axios');
const querystring = require('querystring');
const cheerio = require('cheerio');
const flatten = require('lodash.flatten');

class Scrape {
	constructor(query) {
		this.query = query;
	}
	all() {
		return new Promise((res, rej) => {
			//fetch page data
			axios.get('https://www.google.com/search?gl=us&q=' + this.query, {
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
					var result_link = $('div.ZINbbc > div.egMi0 > a')[link_index].attribs.href;
					var result_snippet = $('#main > div > div > div > div:not(.v9i61e) > div.AP7Wnd')[i];
					if (!(result_link.startsWith('/url?esrc=') || result_link.startsWith('http://www.google.com/url?esrc=') || result_link.startsWith('https://www.google.com/url?esrc='))) {
						var c = $('div.ZINbbc > div:nth-child(1) > a')[link_index].attribs;
						if (c) {
							result_link = c.href;
						} else {
							result_link = null;
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
			}).catch((e) => { rej(); });
		});
	}
	duckducksearch(result_num) {
		return new Promise((res, rej) => {
			axios.get(`https://lite.duckduckgo.com/lite/?dc=${result_num}&q=${this.query}`, {
				headers: {
					'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
				}
			}).then(a => {
				var $ = cheerio.load(a.data);

				var results = [];

				$('a.result-link').each((i, a) => {
					var b = { title: a.data ? a.data : a.children[0].data, link: a.attribs.href, snippet: String($('td.result-snippet').eq(i).html()).trim().replace('\n', '') };

					results.push(b);

					return;
				});

				return res(results);
			}).catch((e) => { rej(); });
		});
	}
	images() {
		return new Promise((res, rej) => {
			axios.get('https://google.com/search?tbm=isch&q=' + this.query, {
				headers: {
					'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
				}
			}).then(a => {
				var $ = cheerio.load(a.data);

				var scripts = $('script');

				var contents = [];

				for (var i = 0; i < scripts.length; ++i) {
					if (scripts[i].children.length > 0) {
						const content = scripts[i].children[0].data;
						contents.push(content);
					}
				}

				const results = (content) => {
					var refs = [];
					var re = /\["(http.+?)",(\d+),(\d+)\]/g;
					var result;
					while ((result = re.exec(content)) !== null) {
						if (result.length > 3) {
							var ref = {
								url: result[1]
							};
							if (!ref.url.includes('gstatic')) {
								refs.push(ref);
							}
						}
					}
					return refs;
				};

				return res(flatten(contents.map(results)));
			}).catch((e) => { rej(); });
		});
	}
	weather() {
		return new Promise((res, rej) => {
			const weather = require('weather-js');
			weather.find({ search: this.query, degreeType: 'C' }, (err, data) => {
				if (err) return rej();
				if (data) {
					if (data[0]) {
						return res({ current: data[0].current.temperature, location: data[0].current.observationpoint });
					} else {
						return rej();
					}
				} else {
					return rej();
				}
			});
		});
	}
}

module.exports = Scrape;
