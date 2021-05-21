document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search);
	if (window.location.pathname.includes('news')) {
		$('#nav_news').attr('class', 'btn btn-outline-primary')
	} else if (window.location.pathname.includes('images')) {
		$('#nav_images').attr('class', 'btn btn-outline-primary')
	} else {
		$('#nav_all').attr('class', 'btn btn-outline-primary')
	}
	document.getElementById('nav_all').addEventListener('click', () => {
		window.location.href = '/search?q=' + params.get('q');
	});
	document.getElementById('nav_images').addEventListener('click', () => {
		window.location.href = '/search/images?q=' + params.get('q');
	});
	document.getElementById('nav_news').addEventListener('click', () => {
		window.location.href = '/search/news?q=' + params.get('q');
	});
})