document.addEventListener('DOMContentLoaded', () => {
	//functions

	const validate_item = (a) => {
		if (document.getElementById(String(a))) {
			return true;
		}
		return false;
	};

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
		fetch('/autocomplete?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
			if (data[1].length !== 0) {
				document.getElementsByClassName('autocomplete-items')[0].innerHTML = '';
				data[1].forEach((a) => {
					document.getElementsByClassName('autocomplete-items')[0].innerHTML += `<p id='autofill-item' onclick='window.location.href = "/search?q=${a}"'>${a.replace(document.getElementById('search').value, `<strong>${document.getElementById('search').value}</strong>`)}</p>`;
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
			//image search results
			fetch('/results/images?q=' + params.get('q')).then(resp => resp.json()).then((a) => {
				document.getElementById('credit').style.position = '';
				document.getElementsByClassName('loader')[0].remove();
				a.forEach((result, i) => {
					document.getElementById('image_results').innerHTML += `<img src='/proxy?q=${result.url}' loading="lazy" style='width: 300px; height: 200px; object-fit: cover; border-radius: 15px; padding:10px; cursor: pointer;' onerror="this.remove()" onclick='window.open("/proxy?q=${result.url}")'></img>`;
				});
			});
			$('#nav_images').attr('class', 'btn btn-outline-primary');
		} else {
			//search results
			fetch('/results/search?q=' + params.get('q')).then(resp => resp.json()).then((a) => {
				document.getElementById('credit').style.position = '';
				document.getElementsByClassName('loader')[0].remove();
				a.forEach((b, i) => {
					var c = localStorage.getItem('private_url') ? true : false;
					if (i === 1) {
						document.getElementById('results').innerHTML += '<div id="related"></div>';
					} else if (i === a.length - 1) {
						//knowledge
						try {
							math.parse(document.getElementById('search').value);
							document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${math.evaluate(document.getElementById('search').value)}</h6></div></div>`;
						} catch (e) { }
						fetch('/knowledge?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
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
			window.location.href = 'https://maps.google.com/maps?q=' + encodeURIComponent(params.get('q'));
		});
	}

	//settings

	if (validate_item('settings_modal')) {
		const settings = [{
			name: 'Private Browse Proxy URL',
			value: 'private_url'
		}];
		settings.forEach((a, i) => {
			var b = localStorage.getItem(a.value);
			document.getElementById('settings_form').innerHTML += `<div class="form-group"><label for="${a.value}">${a.name}</label> <input type="text" class="form-control color-dark" id="${a.value}" value='${b ? b : ""}' style='color: #fff;' autocomplete='off' placeholder="Value"></div>`;
		});
		document.getElementById('settings_form').innerHTML += `<div class="modal-footer"><input class="btn btn-primary" type="submit"></div>`;
		document.getElementById('settings').addEventListener('click', () => {
			$('#settings_modal').modal('show');
		});
		document.getElementById('settings_form').addEventListener('submit', (e) => {
			e.preventDefault();
			settings.forEach((a, i) => {
				localStorage.setItem(a.value, document.getElementById(a.value).value);
				if (i === settings.length - 1) {
					window.location.reload();
				}
			});
		});
	}
});

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