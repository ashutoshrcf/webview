// Post data when form is submitted
submitForm = async function () {
    // Get data from query string
    const queryParams = new URLSearchParams(document.location.search);
    const userId = queryParams.get('userId');
    const conversationId = queryParams.get('convId');
    const botId = queryParams.get('botId');

    // Get data from form
    var vin = document.querySelector('input[name="vin"]').value;
    var fname = document.querySelector('input[name="fname"]').value;
    var lname = document.querySelector('input[name="lname"]').value;
    var email = document.querySelector('input[name="email"]').value;
    var contact = document.querySelector('input[name="phone"]').value;
    var houseNo = document.querySelector('input[name="houseNumber"]').value;
    var postcode = document.querySelector('input[name="postcode"]').value;

    // process variables
    fname = fname.trim();
    lname = lname.trim();
    var fullName = titleCase(fname + ' ' + lname);

    vin = vin.toUpperCase();

    postcode = postcode.toUpperCase().replace(/\s/g, '');

    function titleCase(str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }

    // use correct domain for your region
    const domain = 'https://lo.bc-intg.liveperson.net/thirdparty-services-0.1/webview';
    // encode auth string
    const authString = `${conversationId} || ${botId}`;
    const auth = await sha256(authString);

    const resWebview = await postData(auth, domain, {
        botId,
        conversationId,
        userId,
        message: "AYO:FORM SUBMITTED SUCCESSFULLY", // optional
        contextVariables: [{
            "name": "vin",
            "value": vin
        }, {
            "name": "fullName",
            "value": fullName
        }, {
            "name": "email",
            "value": email
        }, {
            "name": "contact",
            "value": contact
        }, {
            "name": "houseNo",
            "value": houseNo
        }, {
            "name": "postcode",
            "value": postcode
        }]
    });

    console.log('WEBVIEW RESPONSE -->' + resWebview);

    const resPipedream = await postToMiddleware('https://enpkjyszk96avvv.m.pipedream.net', {
        "Full Name": fullName,
        "VIN": vin,
        "Contact": contact,
        "Email": email,
        "House Number": houseNo,
        "Postcode": postcode
    });

    console.log('PIPEDREAM RESPONSE -->' + resPipedream);

    //disable input fields
    Array.from(document.getElementsByTagName('input')).forEach(x => x.setAttribute("disabled", true));
    //disable button
    Array.from(document.getElementsByTagName('button')).forEach(x => x.setAttribute("disabled", true));
}


// Post data to Web View API
async function postData(auth, url = '', data = {}) {
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
}


//pipedream test
async function postToPipedream(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

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
