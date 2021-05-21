document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search);
	document.getElementById('nav_all').addEventListener('click', () => {
		window.location.href = '/search?q=' + params.get('q');
	});
	document.getElementById('nav_images').addEventListener('click', () => {
		window.location.href = '/search/images?q=' + params.get('q');
	});
})