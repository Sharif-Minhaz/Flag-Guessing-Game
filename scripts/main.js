const pageLoader = document.getElementById("page-loader");

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
	optionsIndex = [],
	country;

let successText = [
		"Wow! amazing",
		"Amazing! well done",
		"Awesome!",
		"Brilliant!",
		"You beauty :)",
		"Outstanding!!!",
		"Fantastic!!",
	],
	failureText = ["Wrong answer!!", "Oops, wrong answer", "Incorrect!", "Wrong, take your time"];

// Axios [fetched data with api]
axios
	.get("https://restcountries.com/v3/all?fields=name,flags")
	.then((res) => {
		pageLoader.classList.remove("wrapper");
		data = res.data;
		countryNames = data.map((country) => country.name.common);

		// set country
		setCountry();
	})
	.catch((err) => {
		console.error(err);
	});

// get random index between 0 - 249
function getRandomNumber() {
	return Math.floor(Math.random() * data.length); // data.length = 250
}

// add five option including the correct one
function addFiveOptions(countryNames) {
	// first cleared the existing options
	removeOptions();

	// get random 5 unique options
	const INIT_OPT = 5; // default option count
	while (optionsIndex.length < INIT_OPT) {
		let index = getRandomNumber();
		// push only when the index is unique
		if (!optionsIndex.includes(index) && !optionsIndex.includes(country.index)) {
			optionsIndex.push(index);
		}
	}

	// put the original answer's index in the optionIndex array
	optionsIndex.splice(Math.floor(Math.random() * 6), 0, country.index);

	// set single option every time
	optionsIndex.forEach((i) => {
		setOptions(countryNames[i]);
	});
}

// add one option dynamically in the dropdown
function setOptions(countryName) {
	nameInput.options.add(new Option(countryName, countryName.toLowerCase()));
}

// remove existed options
function removeOptions() {
	// reset index;
	optionsIndex = [];

	// remove all options except the first one
	while (nameInput.options.length > 1) {
		nameInput.removeChild(nameInput.options[1]);
	}
}

// handle the user input and match it
function handleCheck(e) {
	// check for unselect case
	if (nameInput.value === "--Select country--") {
		alert("Select a country to check!");
		return 0;
	}

	e.target.disabled = true;
	nameInput.disabled = true;

	// verify the answer
	if (nameInput.value.toLowerCase() === country.name.common.toLowerCase()) {
		points.innerText = Number(points.innerText) + 1;
		!answer.classList.contains("success") && answer.classList.add("success");
		answer.innerText =
			successText[Math.floor(Math.random() * (successText.length))] + " (+1 point)";

		// set result to modal
		showFinalResult();
	} else {
		!answer.classList.contains("fail") && answer.classList.add("fail");

		answer.innerText =
			failureText[Math.floor(Math.random() * (failureText.length))] +
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
	nameInput.value = "--Select country--";
	points.innerText = "0";
	answer.innerText = "Take time, Think well";
	showFinalResult();
	triggerBtn.classList.add("d-none");
}

// set country flag and store name for later
function setCountry() {
	let index = getRandomNumber();
	country = data[index];
	country.index = index;
	flag.src = country.flags[1];

	// add five options
	addFiveOptions(countryNames);
}

// handle the next button
function handleNext(e) {
	if (turnNumber.innerText < 10) {
		checkBtn.disabled = false;
		nameInput.disabled = false;

		// increase turn number every time
		turnNumber.innerText = Number(turnNumber.innerText) + 1;

		if (Number(turnNumber.innerText) === 10) {
			nextBtn.disabled = true;
			triggerBtn.classList.remove("d-none");
		}

		// clear the classes
		clearClasses();

		answer.innerText = "Take time, Think well";

		setCountry();
		showFinalResult();
	} else {
		nextBtn.disabled = true;
	}
}

// clear classes when resetting or going next flag
function clearClasses() {
	// clear success and fail classes
	answer.classList.contains("success") && answer.classList.remove("success");
	answer.classList.contains("fail") && answer.classList.remove("fail");
}

// handle final result and modal
function showFinalResult() {
	if (Number(points.innerText) < 6) {
		resModal.innerHTML = `<p class='text-danger'>Your final points is ${points.innerText}. Sorry, you lose. 😫😥</p>`;
	} else if (Number(points.innerText) >= 6) {
		resModal.innerHTML = `<p class='text-success'>Your final points is ${points.innerText}. Excellent, you win. 😊🎉🎊</p>`;
	}
}
