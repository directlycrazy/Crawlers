document.addEventListener('DOMContentLoaded', () => {
	try {
		math.parse(document.getElementById('search').value);
		document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${math.evaluate(document.getElementById('search').value)}</h6></div></div>`;
	} catch (e) { }
	fetch('/knowledge?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
		if (data.heading) {
			document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">${data.heading}</h4><h6 class="text-muted card-subtitle mb-2">${data.description ? data.description.replace(/[\n]/g, '<br />') : ""}</h6><h6 class="text-muted card-subtitle mb-2"><a href='${data.url}'>${data.source}</a></h6></div></div>`;
		} else if (data.answer) {
			document.getElementById('instant').innerHTML += `<div class="card" style='max-width: 600px; hyphens: auto; margin-bottom: 16px;'><div class="card-body" style="max-width: 48em;background: #36393e;"><h4 class="card-title">Answer</h4><h6 class="text-muted card-subtitle mb-2">${data.answer.replace(/[\n]/g, '<br />')}</h6></div></div>`;
		}
	});
})