function nightMode() {
	if(weatherEngine.preferences.nightMode) {
		document.body.className = "";
	} else {
		document.body.className = "nightMode";
	}

	// Update the user's preferences.
	weatherEngine.preferences.nightMode = !weatherEngine.preferences.nightMode;
	writeSettings();
}

function toggleSettingsPane() {
	if(!weatherEngine.settingsPane.visible && window.localStorage) {
		weatherEngine.settingsPane["celsiusConvertEnabled"] = weatherEngine.preferences["celsius"];
		// Populate the fields on the Settings Pane with their saved values.
		var rememberLocation = document.getElementById("rememberLoc");
		if(weatherEngine.preferences["location"] !== "") {
			rememberLocation.checked = true;
		}
		var hotColdField = document.getElementById("hotColdThreshold");
		var windStillField = document.getElementById("windyStillThreshold");
		var humidAridField = document.getElementById("humidAridThreshold");

		hotColdField.value = weatherEngine.preferences["hotColdThreshold"];
		windStillField.value = weatherEngine.preferences["windyThreshold"];
		humidAridField.value = weatherEngine.preferences["humidityThreshold"];

		// Get the correct units.
		var hotColdFooter = document.getElementById("hotColdUnits");
		var windStillFooter = document.getElementById("windyStillUnits");

		// Remove old unit text, if applicable.
		if(hotColdFooter.childNodes[1]) {
			hotColdFooter.removeChild(hotColdFooter.childNodes[1]);
		}
		if(windStillFooter.childNodes[1]) {
			windStillFooter.removeChild(windStillFooter.childNodes[1]);
		}

		// Append the unit text.
		hotColdFooter.appendChild(document.createTextNode((weatherEngine.preferences["celsius"] ? "Celsius" : "Fahrenheit")));
		windStillFooter.appendChild(document.createTextNode((weatherEngine.preferences["celsius"] ? "km/h" : "mph")));

		// Pick the correct unit radio button.
		var celsiusButton = document.getElementById("celsiusRadio");
		var fahrenheitButton = document.getElementById("fahrenheitRadio");

		if(weatherEngine.preferences["celsius"]) {
			celsiusButton.checked = true;
		} else {
			fahrenheitRadio.checked = true;
		}

		// Show the pane and hide other UI elements.
		weatherEngine.returnTo = document.getElementsByClassName("visible")[0];
		weatherEngine.returnTo.className = "hidden";
		document.getElementById("settingsPane").className = "visible";
	} else if(window.localStorage) {
		document.getElementById("settingsPane").className = "hidden";
		weatherEngine.returnTo.className = "visible";
	} else {
		alert("Sorry, your browser doesn't support saving settings.");
	}
	weatherEngine.settingsPane.visible = !weatherEngine.settingsPane.visible;
}

function changeLocation() {
	var textField = document.getElementById("userLocation");
	if(textField.value !== "") {
		weatherEngine.preferences.lastLocation = textField.value;
		makeRequest(weatherEngine.preferences.lastLocation);
	} else {
		geolocate();
	}
}

function saveSettings() {
	// Check if we should save the current location.
	var locationSave = document.getElementById("rememberLoc");
	if(locationSave.checked) {
		weatherEngine.preferences["location"] = weatherEngine.preferences["lastLocation"];
	} else {
		weatherEngine.preferences["location"] = "";
	}

	// Save all other fields.
	var hotColdField = document.getElementById("hotColdThreshold");
	var windStillField = document.getElementById("windyStillThreshold");
	var humidAridField = document.getElementById("humidAridThreshold");
	
	// ...but validate them first.
	var parsedHotCold = parseInt(hotColdField.value);
	var parsedWindStill = parseInt(windStillField.value);
	var parsedHumidity = parseInt(humidAridField.value);
	if(!isNaN(parsedHotCold)) {
		weatherEngine.preferences["hotColdThreshold"] = parsedHotCold;	
	}
	if(!isNaN(parsedWindStill) && parsedWindStill > 0) {
		weatherEngine.preferences["windyThreshold"] = parsedWindStill;
	}
	if(!isNaN(parsedHumidity) && parsedHumidity > 0) {
		weatherEngine.preferences["humidityThreshold"] = parsedHumidity;
	}

	var celsiusButton = document.getElementById("celsiusRadio");
	weatherEngine.preferences["celsius"] = celsiusButton.checked;

	writeSettings();
	toggleSettingsPane();
	refreshWeather();
}

function convertUnits() {
	// Get our fields.
	var hotColdField = document.getElementById("hotColdThreshold");
	var windStillField = document.getElementById("windyStillThreshold");

	var hotColdUnits = document.getElementById("hotColdUnits");
	var windyStillUnits = document.getElementById("windyStillUnits");

	// Remove old unit text.
	if(hotColdUnits.childNodes[1]) {
		hotColdUnits.removeChild(hotColdUnits.childNodes[1]);
	}
	if(windyStillUnits.childNodes[1]) {
		windyStillUnits.removeChild(windyStillUnits.childNodes[1]);
	}

	// Get our values.
	var parsedHotCold = parseInt(hotColdField.value);
	var parsedWindStill = parseInt(windStillField.value);

	// Validate them.
	if(isNaN(parsedHotCold)) {
		parsedHotCold = weatherEngine.preferences["hotColdThreshold"];
	}
	if(isNaN(parsedWindStill) || parsedWindStill < 0) {
		parsedWindStill = weatherEngine.preferences["windyThreshold"];
	}

	// Check what unit to convert to.
	var celsiusButton = document.getElementById("celsiusRadio");
	if(celsiusButton.checked && !weatherEngine.settingsPane["celsiusConvertEnabled"]) {
		// Convert Fahrenheit to Celsius.
		hotColdField.value = Math.round((parsedHotCold - 32) * (5/9));

		// Convert mph to kph.
		windStillField.value = Math.round(parsedWindStill * 1.609344);

		// Disable converting here again.
		weatherEngine.settingsPane["celsiusConvertEnabled"] = true;
	} else if(!celsiusButton.checked && weatherEngine.settingsPane["celsiusConvertEnabled"]){
		// Convert Celsius to Fahrenheit.
		hotColdField.value = Math.round(parsedHotCold * (9/5) + 32);

		// Convert kph to mph.
		windStillField.value = Math.round(parsedWindStill / 1.609344);
		
		// Disable converting here again.
		weatherEngine.settingsPane["celsiusConvertEnabled"] = false;
	}

	// Append the unit text.
	hotColdUnits.appendChild(document.createTextNode((weatherEngine.settingsPane["celsiusConvertEnabled"] ? "Celsius" : "Fahrenheit")));
	windyStillUnits.appendChild(document.createTextNode((weatherEngine.settingsPane["celsiusConvertEnabled"] ? "km/h" : "mph")));
}

function resetSettings() {
	var confirmation = confirm("This will reset all settings to their defaults. Continue?");
	if(confirmation) {
		window.localStorage.clear();
		location.reload();
	}
}