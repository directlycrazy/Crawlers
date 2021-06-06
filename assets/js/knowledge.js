document.addEventListener('DOMContentLoaded', () => {
	try {
		math.parse(document.getElementById('search').value);
		document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${math.evaluate(document.getElementById('search').value)}</h6></div></div>`;
	} catch (e) { }
	fetch('/knowledge?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
		if (data.heading) {
			document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">${data.heading}</h4><h6 class="text-muted card-subtitle mb-2" style='overflow: hidden;display: -webkit-box;-webkit-line-clamp: 10;-webkit-box-orient: vertical;'>${data.description ? data.description.replace(/[\n]/g, '<br />') : ""}</h6><h6 class="text-muted card-subtitle mb-2"><a href='${data.url}'>${data.source}</a></h6></div></div>`;
		} else if (data.answer) {
			document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${data.answer.replace(/[\n]/g, '<br />')}</h6></div></div>`;
		}
		if (data.related.length !== 0) {
			document.getElementById('related').innerHTML += `<div class="card" style='max-width: 600px; margin-left: 56px; margin-right: 56px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e; padding-bottom: 0;"><h4 class="card-title">Related Topics</h4><div class='row flex-nowrap' style='overflow: auto; padding-bottom: 1.25rem;' id='related_topics'></div></div></div>`;
			data.related.forEach((a, i) => {
				if (a.Result) {
					var string = ('<a' + a.Result.replace(/<a|<[/]a>/g, '|').split('|')[1] + '</a>').replace('https://duckduckgo.com/c/', '/search?q=').replace('https://duckduckgo.com/', '/search?q=').replace(/_/g, '%20')
					document.getElementById('related_topics').innerHTML += `<div class='col'><div class='card topic' style="background: #282b30; height: 100%;"><h6 class="text-muted card-subtitle" style='margin:auto;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;'>${string}</h6></div></div>`;
				}
			});
		}
	});
})