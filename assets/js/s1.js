document.addEventListener('DOMContentLoaded', () => {
	//functions

	const validate_item = (a) => {
		if (document.getElementById(String(a))) {
			return true;
		}
		return false;
	};

	//frontpage animation

	$('[data-bss-hover-animate]').mouseenter(() => {
		var elem = $(this);
		elem.addClass('animated ' + elem.attr('data-bss-hover-animate'));
	}).mouseleave(() => {
		var elem = $(this);
		elem.removeClass('animated ' + elem.attr('data-bss-hover-animate'));
	});

	//autocomplete

	document.getElementsByClassName('form-group')[0].innerHTML += `<div class="autocomplete-items" style='background: #36393e; box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%); margin-bottom: 5px; text-align: left;'></div>`;
	document.getElementById('search').addEventListener('keyup', () => {
		if (!document.getElementById('search').value) { document.getElementsByClassName('autocomplete-items')[0].innerHTML = ''; };
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
			$('#nav_images').attr('class', 'btn btn-outline-primary');
		} else {
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

	//knowledge

	if (validate_item('instant')) {
		try {
			math.parse(document.getElementById('search').value);
			document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${math.evaluate(document.getElementById('search').value)}</h6></div></div>`;
		} catch (e) { }
		fetch('/knowledge?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
			if (data.heading) {
				document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;">${data.image ? `<img class="knowledge_image" src="/proxy?q=https://duckduckgo.com${data.image}" style="float: right; max-height: 120px; max-width: 120px; margin: 15px;">` : ""}<h4 class="card-title" style="word-wrap: normal !important;">${data.heading}</h4><h6 class="text-muted card-subtitle mb-2" style='overflow: hidden;display: -webkit-box;-webkit-line-clamp: 10;-webkit-box-orient: vertical;'>${data.description ? data.description.replace(/[\n]/g, '<br />') : ""}</h6><h6 class="text-muted card-subtitle mb-2"><a href='${data.url}'>${data.source}</a></h6></div></div>`;
			} else if (data.answer) {
				document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${data.answer.replace(/[\n]/g, '<br />')}</h6></div></div>`;
			}
			if (data.related.length !== 0) {
				document.getElementById('related').innerHTML += `<div class="card" style='max-width: 600px; margin-left: 56px; margin-right: 56px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e; padding-bottom: 0;"><h4 class="card-title">Related</h4><div class='row flex-nowrap' style='overflow: auto; padding-bottom: 1.25rem;' id='related_topics'></div></div></div>`;
				data.related.forEach((a, i) => {
					if (a.Result) {
						var string = ('<a' + a.Result.replace(/<a|<[/]a>/g, '|').split('|')[1] + '</a>').replace('https://duckduckgo.com/c/', '/search?q=').replace('https://duckduckgo.com/', '/search?q=').replace(/_/g, '%20');
						document.getElementById('related_topics').innerHTML += `<div class='col-8 col-md-5'><div class='card topic' style="background: #282b30; height: 100%;"><h6 class="text-muted card-subtitle" style='margin:auto;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical; text-align: center;'>${string}</h6></div></div>`;
					}
				});
			}
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