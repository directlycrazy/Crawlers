/*
	 _____                    _               
	/ ____|                  | |              
 | |     _ __ __ ___      _| | ___ _ __ ___ 
 | |    | '__/ _` \ \ /\ / / |/ _ \ '__/ __|
 | |____| | | (_| |\ V  V /| |  __/ |  \__ \
	\_____|_|  \__,_| \_/\_/ |_|\___|_|  |___/
																					  
*/

$(document).ready(() => {
	//themes
	if (localStorage.getItem('custom_css') === null) {
		localStorage.setItem('custom_css', `:root {\n--dark: #36393e;\n--darker: #282b30;\n--text: #fff;\n--accent: #009688;\ncolor-scheme: dark;\n}`);
	}

	//loading animation
	if ($('#results').length || $('#image_results').length) {
		$('#credit').css({ 'position': 'fixed', 'bottom': '0', 'left': '0' });
		$('body').append(`<div style='position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);' class='loader'><div id="loading"></div></div>`);
	}

	//autocomplete
	$('.form-group:first').append(`<div class="autocomplete-items color-dark" style='box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%); margin-bottom: 5px; text-align: left;'></div>`);
	$('#search').keypress(() => {
		if (!$('#search').val()) {
			return $('.autocomplete-items:first').html('');
		}
		$.ajax({
			url: `/autocomplete?q=${encodeURIComponent($('#search').val())}`
		}).done((data) => {
			if (data[1].length) {
				$('.autocomplete-items:first').html('');
				data[1].forEach((a) => {
					$('.autocomplete-items:first').append(`<p id='autofill-item' onclick='window.location.href = "/search?q=${encodeURIComponent(a)}"'>${a.replace($('#search').val(), `<strong>${$('#search').val()}</strong>`)}</p>`);
				});
			}
		});
	});

	$('#search').blur(() => {
		if ($('#search').html()) {
			setTimeout(() => {
				return $('.autocomplete-items:first').css({ "position": "fixed", "visibility": "hidden" });
			}, 200);
		}
	});

	$('#search').focus(() => {
		if ($('#search').html()) {
			$('.autocomplete-items:first').css({ "position": "static", "visibility": "visible" });
		}
	});

	//page navigation
	if ($('#nav_all').length) {
		const params = new URLSearchParams(window.location.search);
		if (window.location.pathname.includes('images')) {
			//image results
			$('#nav_images').attr('class', 'btn btn-outline-primary');
			var init_time = new Date().getTime();
			$.ajax({
				url: `/results/images?q=${params.get('q')}`
			}).done(data => {
				$('#load_more_results').css({ "visibility": "visible" });
				var load_time = (Math.abs(init_time - new Date().getTime()) / 1000).toFixed(2);
				$('#results').append(`<p style='opacity: 0.5; padding-left: 5px;'>Response took ${load_time} seconds for ${data.length} results.</p></div>`);
				$('.loader:first').remove();
				data.forEach((a, i) => {
					$('#image_results').append(`<img src='/proxy?q=${a.compressed}' loading="lazy" style='width: 300px; height: 200px; object-fit: cover; border-radius: 15px; padding:10px; cursor: pointer;' onerror="this.remove()" onclick='image_load("${a.url}")'></img>`);
				});
				$('#credit').css({ 'position': '' });
			});
		} else {
			//search results
			const private_browse = localStorage.getItem('private_url') ? true : false;
			$('#nav_all').attr('class', 'btn btn-outline-primary');
			var init_time = new Date().getTime();
			$.ajax({
				url: `/results/search?q=${params.get('q')}`
			}).done(data => {
				$('#load_more_results').css({ 'visibility': 'visible' });
				var load_time = (Math.abs(init_time - new Date().getTime()) / 1000).toFixed(2);
				$('#instant').append(`<p style='opacity: 0.5; padding-left: 5px;'>Response took ${load_time} seconds for ${data.results.length} results.</p></div>`);
				$('#credit').css({ 'position': '' });
				$('.loader:first').remove();
				//spell checking
				if (data.correct_string) {
					$('#results').append(`<div style="padding-right: 56px;padding-left: 56px;"><p style='opacity: 0.5; padding-left: 5px;'>Did you mean <a href='/search?q=${encodeURIComponent(data.correct_string.replace(/(<([^>]+)>)/ig, ""))}' class='accent'>${data.correct_string.replace('<i>', '').replace('</i>', '')}</a>?</p></div>`);
				}
				data.results.forEach((a, i) => {
					if (i === 1) {
						$('#results').append(`<div id="related"></div>`);
					} else if (i === data.results.length - 1) {
						//knowledge panel

						//instant math processing
						try {
							math.parse($('#search').val());
							$('#instant').append(`<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${math.evaluate($('#search').val())}</h6></div></div>`);
						} catch (e) { }

						$.ajax({
							url: `/results/knowledge?q=${data.correct_string ? data.correct_string : $('#search').val()}`
						}).done(knowledge => {
							if (knowledge.heading) {
								$('#instant').append(`<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;">${knowledge.image ? `<img class="knowledge_image" src="/proxy?q=https://duckduckgo.com${knowledge.image}" style="float: right; max-height: 120px; max-width: 120px; margin: 15px;">` : ""}<h4 class="card-title" style="word-wrap: normal !important;">${knowledge.heading}</h4><p class="card-subtitle mb-2" style='font-size: 16px; overflow: hidden;color:#fff;opacity:0.5;display: -webkit-box;-webkit-line-clamp: 10;-webkit-box-orient: vertical;'>${knowledge.description ? knowledge.description.replace(/[\n]/g, '<br />') : ""}</p><h6 class="text-muted card-subtitle mb-2"><a class='accent' href='${knowledge.url}'>${knowledge.source}</a></h6></div></div>`);
							} else if (knowledge.answer) {
								$('#instant').append(`<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${knowledge.answer.replace(/[\n]/g, '<br />')}</h6></div></div>`);
							}
							//related topics
							if (knowledge.related.length) {
								$('#related').append(`<div class="card" style='max-width: 600px; margin-left: 56px; margin-right: 56px; hyphens: auto; margin-bottom: 16px;'><div class="card-body color-dark" style="max-width: 48em; padding-bottom: 0;"><h4 class="card-title">Related</h4><div class='row flex-nowrap' style='overflow: auto; padding-bottom: 1.25rem;' id='related_topics'></div></div></div>`);
								knowledge.related.forEach((a, i) => {
									if (a.Result) {
										var string = ('<a class="accent" ' + a.Result.replace(/<a|<[/]a>/g, '|').split('|')[1] + '</a>').replace('https://duckduckgo.com/c/', '/search?q=').replace('https://duckduckgo.com/', '/search?q=').replace(/_/g, '%20');
										$('#related_topics').append(`<div class='col-8 col-md-5'><div class='card topic color-darker' style="height: 100%;"><h6 class="text-muted card-subtitle accent" style='margin:auto;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical; text-align: center;'>${string}</h6></div></div>`);
									}
								});
							}
						});
					}
					$('#results').append(`<div style="padding-right: 56px;padding-left: 45px;"><div class="result" style="margin-left: 11px; max-width: 600px;"><span>${private_browse ? `<i class="fa fa-user-secret" style='opacity: 0.5; cursor: pointer; display: inline-block;padding-top:5px;padding-left:7px;' onclick="window.location.href = localStorage.getItem('private_url') + '${a.link}'" aria-hidden="true"></i>` : ""}  <p style="margin-bottom: 0px;opacity: 0.50;display:inline-block;font-size: 14px; margin-left: 5px;" id='${i}_link_header'></p></span><p style="margin-bottom: 0px; margin-left: 5px;"><a class='accent' id='${i}_link' href="#"><br></a></p><p style="opacity: 0.50; margin-left: 5px; padding-bottom: 5px;" id='${i}_snippet'></p></div></div>`);
					$(`#${i}_link_header`).text(a.link.split('/')[2]);
					if (a.link.includes('google.com/aclk')) {
						$(`#${i}_link_header`).html('<b>Ad</b> - ' + $(`#${i}_link_header`).html());
					}
					$(`#${i}_link`).text(a.title);
					$(`#${i}_link`).attr('href', a.link);
					$(`#${i}_snippet`).text(a.snippet);
				});
			});

			//extra results loading
			$('#load_more_results').click(() => {
				if ($('#load_more_results').html().includes('NO MORE RESULTS')) return;
				$.ajax({
					url: `/results/search/pages?q=${params.get('q')}&r=0`
				}).done(data => {
					$('#load_more_results').html('<span style="width: 600px;">NO MORE RESULTS</span>');
					var current_results = [];
					var index = 1 + document.querySelector('#results').childElementCount;
					for (var i = 0; i < index; i++) {
						var element = $(`#${i}_link`);
						if (element.length && element.attr('href')) {
							current_results.push(element.attr('href'));
						}
					}
					data.forEach((a, i) => {
						if (current_results.includes(a.link) === false) {
							$('#results').append(`<div style="padding-right: 56px;padding-left: 45px;"><div class="result" style="margin-left: 11px; max-width: 600px;"><span>${private_browse ? `<i class="fa fa-user-secret" style='opacity: 0.5; cursor: pointer; display: inline-block;padding-top:5px;padding-left:7px;' onclick="window.location.href = localStorage.getItem('private_url') + '${a.link}'" aria-hidden="true"></i>` : ""}  <p style="margin-bottom: 0px;opacity: 0.50;display:inline-block;font-size: 14px; margin-left: 5px;" id='${index}_link_header'></p></span><p style="margin-bottom: 0px; margin-left: 5px;"><a class='accent' id='${index}_link' href="#"><br></a></p><p style="opacity: 0.50; margin-left: 5px; padding-bottom: 5px;" id='${index}_snippet'></p></div></div>`);
							$(`#${index}_link_header`).text(a.link.split('/')[2]);
							$(`#${index}_link`).text(a.title);
							$(`#${index}_link`).attr('href', a.link);
							$(`#${index}_snippet`).text(a.snippet.replace(/(<([^>]+)>)/ig, ""));
							index++;
						}
					});
				});
			});
		}
		$('#nav_all').click(() => {
			window.location.href = `/search?q=${encodeURIComponent(params.get('q'))}`;
		});
		$('#nav_images').click(() => {
			window.location.href = `/search/images?q=${encodeURIComponent(params.get('q'))}`;
		});
		$('#nav_maps').click(() => {
			window.location.href = `https://www.google.com/maps/search/${encodeURIComponent(params.get('q'))}`;
		});
	}

	//settings handler
	if ($('#settings_modal')) {
		const settings = [{
			name: "Private Browse Proxy URL",
			value: "private_url",
			type: "text"
		}, {
			name: "Custom CSS (Leave Blank to Reset)",
			value: "custom_css",
			type: "textarea"
		}];
		settings.forEach((a, i) => {
			var b = localStorage.getItem(a.value);
			switch (a.type) {
				case 'text':
					$('#settings_form').append(`<div class="form-group"><label for="${a.value}">${a.name}</label> <input type="text" class="form-control color-dark" id="${a.value}" value='${b ? b : ""}' style='color: #fff;' autocomplete='off' placeholder="Value"></div>`);
					break;
				case 'textarea':
					$('#settings_form').append(`<div class="form-group"><label for="${a.value}">${a.name}</label> <textarea class="form-control color-dark" id="${a.value}" style='color: #fff;' rows='7' placeholder="Value">${b ? b : ""}</textarea></div>`);
					break;
			}
		});
		$('#settings_form').append(`<div class="modal-footer"><input class="btn btn-primary" type="submit"></div>`);
		$('#settings').click(() => {
			$('#settings_modal').modal('show');
		});
		$('#settings_form').submit((e) => {
			e.preventDefault();
			settings.forEach((a, i) => {
				var b = '';
				if (a.value === 'private_url') {
					if (!$(`#${a.value}`).val().endsWith('/')) {
						b = $(`#${a.value}`).val() + '/';
					} else {
						b = $(`#${a.value}`).val();
					}
				} else {
					b = $(`#${a.value}`).val();
				}
				localStorage.setItem(a.value, b);
				if (i === settings.length - 1) {
					window.location.reload();
				}
			});
		});
	}

	//version name fetching
	$.ajax({
		url: "/version"
	}).done(data => {
		$('#credit').html(`Crawlers Build ${data.version}`);
	});
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
	$('#search_btn').click(() => {
		return s();
	});
});