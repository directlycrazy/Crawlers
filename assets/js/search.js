$('#form').ready(() => {
	$('#form').submit((e) => {
		e.preventDefault()
		window.location.href = '/search?q=' + document.getElementById('search').value;
		return;
	});
})