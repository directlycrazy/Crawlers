document.addEventListener('DOMContentLoaded', () => {
	fetch('/knowledge?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
		document.getElementById('instant').innerHTML = `<div class="card"><div class="card-body" style="width: 600px;background: #36393e;"><h4 class="card-title" id='instant_heading'></h4><h6 class="text-muted card-subtitle mb-2" id='instant_description'></h6><h6 class="text-muted card-subtitle mb-2" id='instant_source'></h6></div></div>`
		document.getElementById('instant_heading').innerHTML = data.heading
		document.getElementById('instant_description').innerHTML = data.description
		document.getElementById('instant_source').innerHTML = `<a href='${data.url}'>${data.source}</a>`
	});
})