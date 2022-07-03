let turnNumber = document.getElementById("turn-number"),
	points = document.getElementById("points"),
	flag = document.getElementById("flag"),
	nameInput = document.getElementById("name-input"),
	answer = document.getElementById("answer"),
	check = document.getElementById("checkBtn"),
	nextBtn = document.getElementById("nextBtn"),
	resModal = document.getElementById("res-modal"),
	triggerBtn = document.getElementById("trigger-btn");

let data = [],
	countryNames = [],
	country;

let successText = [
		"Wow!",
		"Amazing you get it",
		"Awesome!",
		"Brilliant!",
		"You beauty :)",
		"Outstanding!!!",
		"Fantastic!!",
	],
	failureText = ["Wrong answer :(", "Oops, wrong answer", "Incorrect!", "Wrong, take your time"];

// Axios [fetched data with api]
axios
	.get("https://restcountries.com/v3/all?fields=name,flags")
	.then((res) => {
		data = res.data;
		countryNames = data.map((country) => country.name.common).sort();

		// set options
		countryNames.forEach((countryName) => {
			setOptions(countryName);
		});

		// set country
		setCountry();
	})
	.catch((err) => {
		console.error(err);
	});

// add option dynamically in the dropdown
function setOptions(countryName) {
	nameInput.options.add(new Option(countryName, countryName.toLowerCase()));
}

// handle the user input and match it
function handleCheck(e) {
	if (nameInput.value === "Select country from menu") {
		alert("Select a country to check!");
		return 0;
	}

	e.target.disabled = true;
	nameInput.disabled = true;

	// verify the answer
	if (nameInput.value.toLowerCase() === country.name.common.toLowerCase()) {
		points.innerText = Number(points.innerText) + 1;
		!answer.classList.contains("success") ? answer.classList.add("success") : null;
		answer.innerText =
			successText[Math.floor(Math.random() * (successText.length - 1))] + " +1 point";

		// set result to modal
		showFinalResult();
	} else {
		!answer.classList.contains("fail") ? answer.classList.add("fail") : null;

		answer.innerText =
			failureText[Math.floor(Math.random() * (failureText.length - 1))] +
			", it's " +
			country.name.common;
	}
}

// handle the restart functionality
function handleRestart() {
	setCountry();
	clearClasses();
	turnNumber.innerText = "1";
	nextBtn.disabled = false;
	checkBtn.disabled = false;
	nameInput.disabled = false;
	nameInput.value = "Select country from menu";
	points.innerText = "0";
	answer.innerText = "Take time, Think well";
	showFinalResult();
	triggerBtn.classList.add("d-none");
}

// set country flag and store name for later
function setCountry() {
	country = data[Math.floor(Math.random() * (data.length - 1))];
	flag.src = country.flags[1];
}

function handleNext(e) {
	if (turnNumber.innerText < 10) {
		checkBtn.disabled = false;
		nameInput.disabled = false;

		turnNumber.innerText = Number(turnNumber.innerText) + 1;

		if (Number(turnNumber.innerText) === 10) {
			nextBtn.disabled = true;
			triggerBtn.classList.remove("d-none");
		}

		clearClasses();

		answer.innerText = "Take time, Think well";

		setCountry();
		showFinalResult();
	} else {
		nextBtn.disabled = true;
	}
}

function clearClasses() {
	// clear success and fail classes
	answer.classList.contains("success") ? answer.classList.remove("success") : null;
	answer.classList.contains("fail") ? answer.classList.remove("fail") : null;
}

function showFinalResult() {
	console.log(points.innerText);
	if (Number(points.innerText) < 6) {
		resModal.innerHTML = `<p class='text-danger'>Your final points: ${points.innerText}. Sorry, you loose. 😫😥</p>`;
	} else if (Number(points.innerText) >= 6) {
		resModal.innerHTML = `<p class='text-success'>Your final points: ${points.innerText}. Excellent, you win. 😊🎉🎊</p>`;
	}
}
