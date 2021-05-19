$('#form').ready(() => {
	$('#form').submit((e) => {
		e.preventDefault()
		console.log('ac');
		window.location.href = '/search?q=' + document.getElementById('search').value;
		return;
	});
})