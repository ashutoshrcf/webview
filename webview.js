// Post data when form is submitted
submitForm = async function() {
	// Get data from query string
	const queryParams = new URLSearchParams(document.location.search);
	const userId = queryParams.get('userId');
	const conversationId = queryParams.get('convId');
	const botId = queryParams.get('botId');

	// Get data from form
	const vin = document.querySelector('input[name="full_vin"]').value;
	const name = document.querySelector('input[name="full_name"]').value;
	const email = document.querySelector('input[name="email"]').value;
	const phone = document.querySelector('input[name="phone"]').value;
	const address = document.querySelector('input[name="address"]').value;

	// use correct domain for your region
	const domain = 'https://lo.bc-intg.liveperson.net/thirdparty-services-0.1/webview';
	// encode auth string
	const authString = `${conversationId} || ${botId}`;
	const auth = await sha256(authString);

	const res = await postData(domain, auth, {
		botId,
		conversationId,
		userId,
		message: "SUCCESS", // optional
			contextVariables: [{
				"name": "vin",
				"value": vin
			}, {
				"name": "name",
				"value": name
			}, {
				"name": "email",
				"value": email
			}, {
				"name": "phone",
				"value": phone
			}, {
				"name": "address",
				"value": address
			}]
	});
}



// Post data to Web View API
async function postData(url = '', auth, data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Authorization': auth,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	return await response.json();
};
