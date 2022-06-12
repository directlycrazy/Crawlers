document.addEventListener('DOMContentLoaded', () => {
	//functions

	const validate_item = (a) => {
		if (document.getElementById(String(a))) {
			return true;
		}
		return false;
	};

	//themes
	if (!localStorage.getItem('custom_css')) {
		localStorage.setItem('custom_css', `:root {
		--dark: #36393e;
		--darker: #282b30;
		--text: #fff;
		--accent: #009688;
		color-scheme: dark;
}`);
	}

	//loading animation
	if (validate_item('results') || validate_item('image_results')) {
		document.getElementById('credit').style.position = 'fixed';
		document.getElementById('credit').style.bottom = '0';
		document.getElementById('credit').style.left = '0';
		document.querySelector('body').innerHTML += `<div style='position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);' class='loader'><div id="loading"></div></div>`;
	}

	//autocomplete

	document.getElementsByClassName('form-group')[0].innerHTML += `<div class="autocomplete-items color-dark" style='box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%); margin-bottom: 5px; text-align: left;'></div>`;
	document.getElementById('search').addEventListener('keyup', () => {
		if (!document.getElementById('search').value) { document.getElementsByClassName('autocomplete-items')[0].innerHTML = ''; return; };
		fetch('/autocomplete?q=' + encodeURIComponent(document.getElementById('search').value)).then(resp => resp.json()).then(data => {
			if (data[1].length !== 0) {
				document.getElementsByClassName('autocomplete-items')[0].innerHTML = '';
				data[1].forEach((a) => {
					document.getElementsByClassName('autocomplete-items')[0].innerHTML += `<p id='autofill-item' onclick='window.location.href = "/search?q=${encodeURIComponent(a)}"'>${a.replace(document.getElementById('search').value, `<strong>${document.getElementById('search').value}</strong>`)}</p>`;
					return;
				});
			}
		}).catch(() => {
			document.getElementsByClassName('autocomplete-items')[0].innerHTML = '';
			return;
		});
	});
	document.getElementById('search').addEventListener('blur', () => {
		if (document.getElementsByClassName('autocomplete-items')[0].innerHTML) {
			setTimeout(() => {
				document.getElementsByClassName('autocomplete-items')[0].style.position = 'fixed';
				document.getElementsByClassName('autocomplete-items')[0].style.visibility = 'hidden';
				return;
			}, 200);
		}
	});
	document.getElementById('search').addEventListener('focus', () => {
		if (document.getElementsByClassName('autocomplete-items')[0].innerHTML) {
			document.getElementsByClassName('autocomplete-items')[0].style.position = 'static';
			document.getElementsByClassName('autocomplete-items')[0].style.visibility = 'visible';
			return;
		}
	});

	//navigate

	if (validate_item('nav_all')) {
		const params = new URLSearchParams(window.location.search);
		if (window.location.pathname.includes('news')) {
			$('#nav_news').attr('class', 'btn btn-outline-primary');
		} else if (window.location.pathname.includes('images')) {
			var initiated_time = new Date().getTime();
			//image search results
			fetch('/results/images?q=' + params.get('q')).then(resp => resp.json()).then((a) => {
				var loaded_time = new Date().getTime();
				//results count and time
				document.getElementById('results').innerHTML += `<p style='opacity: 0.5;'>Response took ${(Math.abs(initiated_time - loaded_time) / 1000).toFixed(2)} seconds for ${a.length} results.</p></div>`;
				document.getElementById('credit').style.position = '';
				document.getElementsByClassName('loader')[0].remove();
				a.forEach((result, i) => {
					document.getElementById('image_results').innerHTML += `<img src='/proxy?q=${result.url}' loading="lazy" style='width: 300px; height: 200px; object-fit: cover; border-radius: 15px; padding:10px; cursor: pointer;' onerror="this.remove()" onclick='image_load("${result.url}")'></img>`;
				});
			}).catch((e) => {
				window.location.href = '/error';
			});
			$('#nav_images').attr('class', 'btn btn-outline-primary');
		} else {
			//search results
			var initiated_time = new Date().getTime();
			fetch('/results/search/pages?r=0&q=' + params.get('q')).then(resp => resp.json()).then((a) => {
				document.getElementById('load_more_results').style.visibility = 'visible';
				var loaded_time = new Date().getTime();
				//results count and time
				document.getElementById('instant').innerHTML += `<p style='opacity: 0.5; padding-left: 5px;'>Response took ${(Math.abs(initiated_time - loaded_time) / 1000).toFixed(2)} seconds for ${a.results.length} results.</p></div>`;
				document.getElementById('credit').style.position = '';
				document.getElementsByClassName('loader')[0].remove();
				//ip
				if (document.getElementById('search').value.toLowerCase().includes('ip') && document.getElementById('search').value.toLowerCase().includes('my')) {
					fetch('/ip').then(resp => resp.json()).then(data => {
						document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${data.ip}</h6></div></div>`;
					});
				}
				//weather
				if (document.getElementById('search').value.toLowerCase().includes('weather')) {
					if (document.getElementById('search').value.split(' ').length === 2) {
						var temp = '';
						if (document.getElementById('search').value.split(' ')[0].toLowerCase() === 'weather') {
							fetch('/results/weather?q=' + document.getElementById('search').value.split(' ')[1]).then(resp => resp.json()).then(data => {
								temp = data.current;
								document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title" id='weather_current'>${data.current}°</h4><span class="text-muted card-subtitle mb-2" style="float: right;"><a id='c_temp' class='accent' href='#'>C</a> | <a id='f_temp' class='accent' href='#'>F</a></span><h6 class="text-muted card-subtitle mb-2">In ${data.location}</h6></div></div>`;
								document.getElementById('c_temp').addEventListener('click', () => {
									document.getElementById('weather_current').innerHTML = temp + '°';
								});
								document.getElementById('f_temp').addEventListener('click', () => {
									document.getElementById('weather_current').innerHTML = Math.floor(temp * 1.8000 + 32.00) + '°';
								});
							});
						} else {
							fetch('/results/weather?q=' + document.getElementById('search').value.split(' ')[0]).then(resp => resp.json()).then(data => {
								temp = data.current;
								document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title" id='weather_current'>${data.current}°</h4><span class="text-muted card-subtitle mb-2" style="float: right;"><a id='c_temp' class='accent' href='#'>C</a> | <a id='f_temp' class='accent' href='#'>F</a></span><h6 class="text-muted card-subtitle mb-2">In ${data.location}</h6></div></div>`;
								document.getElementById('c_temp').addEventListener('click', () => {
									document.getElementById('weather_current').innerHTML = temp + '°';
								});
								document.getElementById('f_temp').addEventListener('click', () => {
									document.getElementById('weather_current').innerHTML = Math.floor(temp * 1.8000 + 32.00) + '°';
								});
							});
						}

					}
				}
				//spell check
				var correct_string = '';
				if (a.correct_string) {
					document.getElementById('results').innerHTML += `<div style="padding-right: 56px;padding-left: 56px;"><p style='opacity: 0.5; padding-left: 5px;'>Did you mean <a href='/search?q=${encodeURIComponent(a.correct_string.replace(/(<([^>]+)>)/ig, ""))}' class='accent'>${a.correct_string.replace('<i>', '').replace('</i>', '')}</a>?</p></div>`;
					correct_string = encodeURIComponent(a.correct_string.replace(/(<([^>]+)>)/ig, ""));
				}
				a.results.forEach((b, i) => {
					var c = localStorage.getItem('private_url') ? true : false;
					if (i === 1) {
						document.getElementById('results').innerHTML += '<div id="related"></div>';
					} else if (i === a.results.length - 1) {
						//knowledge
						try {
							math.parse(document.getElementById('search').value);
							document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${math.evaluate(document.getElementById('search').value)}</h6></div></div>`;
						} catch (e) { }
						fetch('/results/knowledge?q=' + (correct_string ? correct_string : document.getElementById('search').value)).then(resp => resp.json()).then(data => {
							if (data.heading) {
								document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;">${data.image ? `<img class="knowledge_image" src="/proxy?q=https://duckduckgo.com${data.image}" style="float: right; max-height: 120px; max-width: 120px; margin: 15px;">` : ""}<h4 class="card-title" style="word-wrap: normal !important;">${data.heading}</h4><p class="card-subtitle mb-2" style='font-size: 16px; overflow: hidden;color:#fff;opacity:0.5;display: -webkit-box;-webkit-line-clamp: 10;-webkit-box-orient: vertical;'>${data.description ? data.description.replace(/[\n]/g, '<br />') : ""}</p><h6 class="text-muted card-subtitle mb-2"><a class='accent' href='${data.url}'>${data.source}</a></h6></div></div>`;
							} else if (data.answer) {
								document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${data.answer.replace(/[\n]/g, '<br />')}</h6></div></div>`;
							}
							//related topics
							if (data.related.length !== 0) {
								document.getElementById('related').innerHTML += `<div class="card" style='max-width: 600px; margin-left: 56px; margin-right: 56px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em; padding-bottom: 0;"><h4 class="card-title">Related</h4><div class='row flex-nowrap' style='overflow: auto; padding-bottom: 1.25rem;' id='related_topics'></div></div></div>`;
								data.related.forEach((a, i) => {
									if (a.Result) {
										var string = ('<a class="accent" ' + a.Result.replace(/<a|<[/]a>/g, '|').split('|')[1] + '</a>').replace('https://duckduckgo.com/c/', '/search?q=').replace('https://duckduckgo.com/', '/search?q=').replace(/_/g, '%20');
										document.getElementById('related_topics').innerHTML += `<div class='col-8 col-md-5'><div class='card topic color-darker' style="height: 100%;"><h6 class="text-muted card-subtitle accent" style='margin:auto;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical; text-align: center;'>${string}</h6></div></div>`;
									}
								});
							}
						}).catch((e) => { });
					}
					document.getElementById('results').innerHTML += `<div style="padding-right: 56px;padding-left: 45px;"><div class="result" style="margin-left: 11px; max-width: 600px;"><span>${c ? `<i class="fa fa-user-secret" style='opacity: 0.5; cursor: pointer; display: inline-block;padding-top:5px;padding-left:7px;' onclick="window.location.href = localStorage.getItem('private_url') + '${b.link}'" aria-hidden="true"></i>` : ""}  <p style="margin-bottom: 0px;opacity: 0.50;display:inline-block;font-size: 14px; margin-left: 5px;" id='${i}_link_header'></p></span><p style="margin-bottom: 0px; margin-left: 5px;"><a class='accent' id='${i}_link' href="#"><br></a></p><p style="opacity: 0.50; margin-left: 5px; padding-bottom: 5px;" id='${i}_snippet'></p></div></div>`;
					document.getElementById(`${i}_link_header`).textContent = b.link.split('/')[2];
					if (b.link.includes('google.com/aclk')) {
						document.getElementById(`${i}_link_header`).innerHTML = '<b>Ad</b> - ' + document.getElementById(`${i}_link_header`).innerHTML;
					}
					document.getElementById(`${i}_link`).textContent = b.title;
					document.getElementById(`${i}_link`).href = b.link;
					document.getElementById(`${i}_snippet`).textContent = b.snippet;
				});

				//load extra results
				document.getElementById('load_more_results').addEventListener('click', () => {
					if (document.getElementById('load_more_results').innerHTML.includes('NO MORE RESULTS')) return;
					fetch('/results/search?q=' + params.get('q')).then(resp => resp.json()).then((a) => {
						var c = localStorage.getItem('private_url') ? true : false;
						a.forEach((b, i) => {
							var index = 1 + document.getElementById('results').childElementCount;
							for (var i = 0; i < index; i++) {
								var a = document.getElementById(i + '_link');
								if (a) {
									if (a.attributes.href === b.link || a.innerHTML === b.title) {
										document.getElementById('load_more_results').innerHTML = '<span style="width: 600px;">NO MORE RESULTS</span>';
										return;
									};
								}
							}
							document.getElementById('results').innerHTML += `<div style="padding-right: 56px;padding-left: 45px;"><div class="result" style="margin-left: 11px; max-width: 600px;"><span>${c ? `<i class="fa fa-user-secret" style='opacity: 0.5; cursor: pointer; display: inline-block;padding-top:5px;padding-left:7px;' onclick="window.location.href = localStorage.getItem('private_url') + '${b.link}'" aria-hidden="true"></i>` : ""}  <p style="margin-bottom: 0px;opacity: 0.50;display:inline-block;font-size: 14px; margin-left: 5px;" id='${index}_link_header'></p></span><p style="margin-bottom: 0px; margin-left: 5px;"><a class='accent' id='${index}_link' href="#"><br></a></p><p style="opacity: 0.50; margin-left: 5px; padding-bottom: 5px;" id='${index}_snippet'></p></div></div>`;
							document.getElementById(`${index}_link_header`).textContent = b.link.split('/')[2];
							document.getElementById(`${index}_link`).textContent = b.title;
							document.getElementById(`${index}_link`).href = b.link;
							document.getElementById(`${index}_snippet`).textContent = b.snippet.replace(/(<([^>]+)>)/ig, "");
						});
					});
					return;
				});
			}).catch((e) => {
				window.location.href = '/error';
			});
			$('#nav_all').attr('class', 'btn btn-outline-primary');
		}
		document.getElementById('nav_all').addEventListener('click', () => {
			window.location.href = '/search?q=' + encodeURIComponent(params.get('q'));
		});
		document.getElementById('nav_images').addEventListener('click', () => {
			window.location.href = '/search/images?q=' + encodeURIComponent(params.get('q'));
		});
		document.getElementById('nav_maps').addEventListener('click', () => {
			window.location.href = 'https://www.openstreetmap.org/search?xhr=1&query=' + encodeURIComponent(params.get('q'));
		});
	}

	//settings

	if (validate_item('settings_modal')) {
		const settings = [{
			name: 'Private Browse Proxy URL',
			value: 'private_url',
			type: 'text'
		}, {
			name: 'Custom CSS',
			value: 'custom_css',
			type: 'textarea'
		}];
		settings.forEach((a, i) => {
			var b = localStorage.getItem(a.value);
			if (a.value === 'custom_css') {
				if (document.getElementById('custom_css_element').innerHTML === '') {
					document.querySelector('#custom_css_element').innerHTML += b;
				}
			}
			switch (a.type) {
				case 'text':
					document.getElementById('settings_form').innerHTML += `<div class="form-group"><label for="${a.value}">${a.name}</label> <input type="text" class="form-control color-dark" id="${a.value}" value='${b ? b : ""}' style='color: #fff;' autocomplete='off' placeholder="Value"></div>`;
					break;
				case 'textarea':
					document.getElementById('settings_form').innerHTML += `<div class="form-group"><label for="${a.value}">${a.name}</label> <textarea class="form-control color-dark" id="${a.value}" style='color: #fff;' rows='7' placeholder="Value">${b ? b : ""}</textarea></div>`;
					break;
			}
		});
		document.getElementById('settings_form').innerHTML += `<div class="modal-footer"><input class="btn btn-primary" type="submit"></div>`;
		document.getElementById('settings').addEventListener('click', () => {
			$('#settings_modal').modal('show');
		});
		document.getElementById('settings_form').addEventListener('submit', (e) => {
			e.preventDefault();
			settings.forEach((a, i) => {
				var b = '';
				if (a.value === 'private_url') {
					if (!document.getElementById(a.value).value.endsWith('/')) {
						b = document.getElementById(a.value).value + '/';
					} else {
						b = document.getElementById(a.value).value;
					}
				} else {
					b = document.getElementById(a.value).value;
				}
				localStorage.setItem(a.value, b);
				if (i === settings.length - 1) {
					window.location.reload();
				}
			});
		});
	}

	//fetch latest commit sha
	fetch('/version').then(resp => resp.json()).then((a) => {
		if (a) {
			document.getElementById('credit').innerHTML = `Crawlers Build (${a.version})`;
		}
	}).catch((e) => { });
});

//image handling

const image_load = (url) => {
	var image = new Image();
	image.src = '/proxy?q=' + url;
	var viewer = new Viewer(image, {
		loop: false,
		keyboard: false,
		movable: false,
		navbar: false,
		rotatable: false,
		scalable: false,
		slideOnTouch: false,
		title: false,
		toggleOnDblclick: false,
		toolbar: false,
		tooltip: false,
		zoomable: false,
		zoomOnTouch: false,
		zoomOnWheel: false,
		hidden: function () {
			viewer.destroy();
		},
	});
	viewer.show();
};

//search

$('#form').ready(() => {
	const s = () => {
		switch (window.location.pathname) {
			case '/search':
				window.location.href = '/search?q=' + encodeURIComponent(document.getElementById('search').value);
				break;
			case '/search/images':
				window.location.href = '/search/images?q=' + encodeURIComponent(document.getElementById('search').value);
				break;
			case '/':
				window.location.href = '/search?q=' + encodeURIComponent(document.getElementById('search').value);
				break;
		}
	};
	$('#form').submit((e) => {
		e.preventDefault();
		return s();
	});
	document.getElementById('search_btn').addEventListener('click', () => {
		return s();
	});
});