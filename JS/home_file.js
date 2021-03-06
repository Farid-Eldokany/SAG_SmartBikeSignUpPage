const homeButtons = document.getElementById("homebuttons");
const loginForm = document.getElementById("loginform");
const signUpForm = document.getElementById("signupform");
const loginMail = document.getElementById("staticEmail");
const signUpMail = document.getElementById("staticEmail2");
const signUpPhone = document.getElementById("staticPhone2");
const signUpName = document.getElementById("staticName2");
const device_id = 2426047;
var prevLogin = ""
const state = {};
state.active = false
const waiting = document.getElementById("waiting");
signUpForm.style.display = "none"
loginForm.style.display = "none"
waiting.style.display = "none"
homeButtons.style.display = "none"
let headers = new Headers();
headers.set('Authorization', 'Basic ZmFyaWQuZWxkb2thbnlAZ21haWwuY29tOkBTQUdmYXJpZDIwMjE=')
headers.set('Content-type', 'application/json')
var wait = setInterval((
	get
), 1000);
function get() {
	state.active = true
	getData(checkLogin)
}
async function getData(parse) {
	if (state.active == true) {
		let response = await fetch('https://swagdxb.eu-latest.cumulocity.com/inventory/managedObjects/' + device_id.toString(), {
			mode: 'cors',
			headers: headers
		});
		data = await response.text();
		parse(data);
	}
}
function updateInventory(data){
    fetch('https://swagdxb.eu-latest.cumulocity.com/inventory/managedObjects/' + device_id.toString(), {
		method: 'PUT',
		body: data,
		mode: 'cors',
		headers: headers
	});
}



function signUp() {
	homeButtons.style.display = "none"
	signUpForm.style.display = "block";
}

function login() {
	homeButtons.style.display = "none"
	loginForm.style.display = "block";
}
function submitSignUpForm() {
	signUpForm.style.display = "none"
	state.active = true;
	getData(getUserData)

}

function submitLoginForm() {
	loginForm.style.display = "none"
	state.active = true;
	getData(verifyLogin)
}



function getUserData(data) {

	var response = JSON.parse(data);
	var name = signUpName.value;
	var mail = signUpMail.value.toLowerCase();
	var phone = signUpPhone.value;
	state.active = false;
	var leaderboard = {
		leaderboard: response["leaderboard"]
	};
	state.active = false;
	leaderboard["leaderboard"][mail] = {
		"name": name,
		"phone": phone
	};
	updateInventory(JSON.stringify({
		"leaderboard": leaderboard["leaderboard"],
		"contestantEmail": mail,
		"contestantPhone": phone,
		"contestantName": name,
        "login": true
	}));
}


function checkLogin(data) {
	state.active = false;
	var response = JSON.parse(data);
	var login = response["login"];
	if (prevLogin !== login) {
		prevLogin = login
		if (login == false) {
			homeButtons.style.display = "block"
			waiting.style.display = "none"
		} else {
			waiting.style.display = "block"
			homeButtons.style.display = "none"

		}
	}
}
function verifyLogin(data) {
	var response = JSON.parse(data);
	var mail = loginMail.value.toLowerCase();
	var json = response["leaderboard"]
	state.active = false
	if (json.hasOwnProperty(mail)) {
		updateInventory(JSON.stringify({
			"contestantEmail": mail,
			"contestantPhone": response["leaderboard"][mail]["phone"],
			"contestantName": response["leaderboard"][mail]["name"],
            "login": true
		}));
	} else {
		hideAll()
		alert("This mail is not registered")
		homeButtons.style.display = "block";
	}
}
