// Post data when form is submitted
submitForm = async function() {
    // Get data from query string
    const queryParams = new URLSearchParams(document.location.search);
    const userId = queryParams.get('userId');
    const conversationId = queryParams.get('convId');
    const botId = queryParams.get('botId');

    // Get data from form
    const vin = document.querySelector('input[name="vin"]').value;
    const fname = document.querySelector('input[name="fname"]').value;
    const lname = document.querySelector('input[name="lname"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const address = document.querySelector('input[name="addressLine1"]').value + document.querySelector('input[name="postcode"]').value;

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
            "name": "fname",
            "value": fname
        }, {
            "name": "lname",
            "value": lname
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

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

// change error messages when input is not validated
var fname = document.getElementById('fname-input');
fname.oninvalid = function(event) {
    event.target.setCustomValidity('Invalid first name');
}

var lname = document.getElementById('lname-input');
lname.oninvalid = function(event) {
    event.target.setCustomValidity('Invalid last name');
}

var vin = document.getElementById('vin-input');
vin.oninvalid = function(event) {
    event.target.setCustomValidity('VIN should be valid and 17 characters long');
}