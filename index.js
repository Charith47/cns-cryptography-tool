let submitButton = document.getElementById('submit-text');
let decryptButton = document.getElementById('decrypt-button');

let plaintext = '';
let ciphertext = '';
let password = '';

submitButton.addEventListener('click', async function (e) {
	e.preventDefault();

	const _iText = document.getElementById('user-input');
	const _iPassword = document.getElementById('user-key');

	plaintext = _iText.value;
	password = _iPassword.value;

	if (plaintext.trim() === '') return alert('An input text is required');
	if (password.trim() === '') return alert('A password is required');

	console.log(plaintext, password);

	const pswUtf8 = new TextEncoder().encode(password);
	const pswHash = await crypto.subtle.digest('SHA-256', pswUtf8);

	const iv = crypto.getRandomValues(new Uint8Array(12));
	const ivString = Array.from(iv)
		.map((bytes) => String.fromCharCode(bytes))
		.join('');

	const options = {
		name: 'AES-GCM',
		iv: iv,
	};

	const key = await crypto.subtle.importKey('raw', pswHash, options, false, [
		'encrypt',
	]);

	const plainTextUint8 = new TextEncoder().encode(plaintext);
	const characterBuffer = await crypto.subtle.encrypt(
		options,
		key,
		plainTextUint8
	);

	const characterArray = Array.from(new Uint8Array(characterBuffer));
	const characterString = characterArray
		.map((byte) => String.fromCharCode(byte))
		.join('');

	ciphertext = btoa(characterString);
	console.log(btoa(characterString));
});

decryptButton.addEventListener('click', async function () {
	const pswUtf8 = new TextEncoder().encode(password); // todo get psw input
	const pswHash = await crypto.subtle.digest('SHA-256', pswUtf8);

	const ivString = atob(ciphertext).slice(0, 12);
	const iv = new Uint8Array(
		Array.from(ivString).map((char) => {
			char.charCodeAt(0);
		})
	);

	const options = {
		name: 'AES-GCM',
		iv: iv,
	};

	const key = await crypto.subtle.importKey('raw', pswHash, options, false, [
		'decrypt',
	]);

	const characterString = atob(ciphertext).slice(12);
	const characterUint8 = new Uint8Array(
		Array.from(characterString).map((character) => character.charCodeAt(0))
	);

	try {
		const plainBuffer = await crypto.subtle.decrypt(
			options,
			key,
			characterUint8
		);
		const plaintext = new TextDecoder().decode(plainBuffer);

		console.log(plaintext);
	} catch (error) {
		console.log(error);
	}
});

//const crypto = self.crypto
