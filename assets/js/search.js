$('#form').ready(() => {
	$('#form').submit((e) => {
		e.preventDefault();
		window.location.href = '/search?q=' + encodeURIComponent(document.getElementById('search').value);
		return;
	});
	document.getElementById('search_btn').addEventListener('click', () => {
		window.location.href = '/search?q=' + encodeURIComponent(document.getElementById('search').value);
		return;
	});
})