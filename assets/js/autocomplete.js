document.addEventListener('DOMContentLoaded', () => {
	document.getElementsByClassName('form-group')[0].innerHTML += `<div class="autocomplete-items" style='background: #36393e; margin-bottom: 5px; text-align: left;'></div>`;
	document.getElementById('search').addEventListener('keyup', () => {
		fetch('/autocomplete?q=' + document.getElementById('search').value).then(resp => resp.json()).then(data => {
			if (data[1].length !== 0) {
				document.getElementsByClassName('autocomplete-items')[0].innerHTML = '';
				data[1].forEach((a) => {
					document.getElementsByClassName('autocomplete-items')[0].innerHTML += `<p id='autofill-item' onclick='window.location.href = "/search?q=${a}"'>${a.replace(document.getElementById('search').value, `<strong>${document.getElementById('search').value}</strong>`)}</p>`;
					return;
				});
			}
		}).catch(() => {
			document.getElementsByClassName('autocomplete-items')[0].innerHTML = '';
			return;
		});
	});
	document.getElementById('search').addEventListener('blur', () => {
		if (document.getElementsByClassName('autocomplete-items')[0].innerHTML) {
			setTimeout(() => {
				document.getElementsByClassName('autocomplete-items')[0].style.position = 'fixed';
				document.getElementsByClassName('autocomplete-items')[0].style.visibility = 'hidden';
				return;
			}, 200);
		}
	});
	document.getElementById('search').addEventListener('focus', () => {
		if (document.getElementsByClassName('autocomplete-items')[0].innerHTML) {
			document.getElementsByClassName('autocomplete-items')[0].style.position = 'static';
			document.getElementsByClassName('autocomplete-items')[0].style.visibility = 'visible';
			return;
		}
	});
})