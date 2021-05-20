$('#form').ready(() => {
	$('#form').submit((e) => {
		e.preventDefault()
		window.location.href = '/search?q=' + encodeURIComponent(document.getElementById('search').value);
		return;
	});
})