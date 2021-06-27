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
					if (!result_link.startsWith('/url?esrc=')) {
						link_index++;
						result_link = $('div.ZINbbc > div:nth-child(1) > a')[link_index].attribs.href;
					}
					results.push({ title: result_title, link: link(result_link), snippet: snippet(result_snippet) });
					link_index++;
				});

				return res(results);
			});
		});
	}
	images() {
		return new Promise(res => {
			axios.get('https://images.google.com/search?tbm=isch&q=' + this.query, {
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
			});
		});
	}
}

module.exports = Scrape;