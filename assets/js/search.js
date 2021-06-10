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
	document.getElementById('search_btn').addEventListener('click', () => {
		return s();
	});
})