// 4-bit Webther.
// A port of 4-bit Weather to the web.
var weatherEngine = {};
weatherEngine.yahooKey = "Xn4xokXV34GvcliwGgGryYVkKUYc3_wDScwUVymdUChA.yuCoVtVgwWOFC25pNIAAFa2nn1NEC19H_DPGw5MF4nAdJFYL5E-";
weatherEngine.woeidFindLatLongURL = "http://where.yahooapis.com/geocode?location=";
weatherEngine.woeidFindURL2 = "&flags=J&gflags=R&appid=";
weatherEngine.weatherURL = "http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid = ";
weatherEngine.weatherURL2 = " and u=";
weatherEngine.weatherURL3 = "&format=json";
weatherEngine.settingsPane = {
	"visible" : false,
	"celsiusConvertEnabled" : null
};

weatherEngine.request = null;
weatherEngine.isIE = false;

weatherEngine.preferences = {
	"nightMode" : false,
	"location" : "",
	"lastLocation" : "",
	"celsius" : true,
	"hotColdThreshold" : 26,
	"windyThreshold" : 11,
	"humidityThreshold" : 80
};

// Weather Codes for rain.
weatherEngine.rainyCodes = {
	"3" : "severe thunderstorms",
	"4" : "thunderstorms",
	"6" : "mixed rain and sleet",
	"9" : "drizzle",
	"11" : "showers",
	"12" : "showers",
	"37" : "isolated thunderstorms",
	"38" : "scattered thunderstorms",
	"39" : "scattered thunderstorms",
	"40" : "scattered showers",
	"45" : "thundershowers",
	"47" : "isolated thundershowers"
};

// Weather Codes for "rain".
weatherEngine.fauxRain = {
	"1" : "tropical storm",
	"2" : "hurricane",
	"5" : "mixed rain and snow",
	"8" : "freezing drizzle",
	"10" : "freezing rain",
	"17" : "hail",
	"35" : "mixed rain and hail",
}
// Weather codes for snow.
weatherEngine.snow = {
	"7" : "mixed snow and sleet",
	"13" : "snow flurries",
	"14" : "light snow showers",
	"15" : "blowing snow",
	"16" : "snow",
	"18" : "sleet",
	"41" : "heavy snow",
	"42" : "scattered snow showers",
	"43" : "heavy snow",
	"46" : "snow showers"
}

// Sunny, and in the day.
weatherEngine.trueShine = {
	"32" :	"sunny",
	"34" :	"fair (day)"
};

// All others.
weatherEngine.fauxShine = {
	"0" : "tornado",
	"19" : "dust",
	"20" :	"foggy",
	"21" :	"haze",
	"22" :	"smoky",
	"23" :	"blustery",
	"24" :	"windy",
	"25" :	"cold",
	"26" :	"cloudy",
	"27" :	"mostly cloudy (night)",
	"28" :	"mostly cloudy (day)",
	"29" :	"partly cloudy (night)",
	"30" :	"partly cloudy (day)",
	"31" :	"clear (night)",
	"33" :	"fair (night)",
	"3200" : "not available"
}

var weatherObject = {};

function initialise() {
	// Detect if we have Local Storage.
	if(window.localStorage) {
		// Check if we have any preferences set.
		var retrievedPrefs = JSON.parse(window.localStorage.getItem("prefs"));
		if(retrievedPrefs) {
			// We do. Restore them.
			for(var property in retrievedPrefs) {
				// Used to support future changes to preferences.
				weatherEngine.preferences[property] = retrievedPrefs[property];
			}
			if(retrievedPrefs.nightMode) {
				document.body.className = 'nightMode';
			}
		}
	}

	// Figure out which HTTP Request thingy to use.
	// IE9 doesn't seem to like XMLHttpRequest.
	if(window.XDomainRequest) {
		// We're on IE.
		weatherEngine.httpRequest = window.XDomainRequest;
		weatherEngine.isIE = true;
	} else {
		// It's cool.
		weatherEngine.httpRequest = XMLHttpRequest;
		weatherEngine.isIE = false;
	}

	weatherEngine.title = document.title;

	// Check if the user specified a location.
	if(weatherEngine.preferences.location !== "") {
		makeRequest(weatherEngine.preferences.location);
	} else {
		// Nope. Figure it out.
		geolocate();
	}
}

function geolocate() {
	// Detect if we have Geolocation support.
	if(navigator.geolocation) {
		// We do! Try to get the user's location.
		navigator.geolocation.getCurrentPosition(locationSuccess, locationFailed);

		// Wait three seconds, then fail.
		weatherEngine.timeOut = setTimeout(locationFailed, 3000);
	} else {
		// We don't. Ask the user for their location.
		locationFailed();
	}
}

function writeSettings() {
	if(window.localStorage) {
		var prefString = JSON.stringify(weatherEngine.preferences);
		window.localStorage.setItem("prefs", prefString);
	}
}

function refreshWeather() {
	makeRequest(weatherEngine.preferences.lastLocation);
}

function makeRequest(locationString) {
	weatherEngine.request = new weatherEngine.httpRequest();
	var finalURL = weatherEngine.woeidFindLatLongURL + locationString + weatherEngine.woeidFindURL2 + weatherEngine.yahooKey;
	
	// Ugly, but this line NEEDS to come before the request is sent.
	if(weatherEngine.isIE) {
		weatherEngine.request.onload = parseWOEID;
	}
	weatherEngine.request.open("GET", finalURL, false);
	weatherEngine.request.send();
 	if(!weatherEngine.isIE){
		parseWOEID();
	}
}

function parseWOEID() {
	try {
		weatherEngine.response = JSON.parse(weatherEngine.request.responseText);

		if(weatherEngine.response.ResultSet) {
			weatherEngine.woeid = weatherEngine.response.ResultSet.Results[0].woeid;
			weatherEngine.city = weatherEngine.response.ResultSet.Results[0].city;
			weatherEngine.state = weatherEngine.response.ResultSet.Results[0].state;
			weatherEngine.country = weatherEngine.response.ResultSet.Results[0].country;

			updateFields();
		} else {
			throw "Sorry, Yahoo! Weather couldn't find that location.";
		}
	} catch(x) {
		if(typeof(x) === "string") {
			alert(x);
		} else {
			alert("Sorry, that doesn't appear to be a valid location.");
		}
	}
}

function locationSuccess (position) {
	clearTimeout(weatherEngine.timeOut);
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var locationString = latitude + "," + longitude;
	makeRequest(locationString);
}

function locationFailed(error) {
	clearTimeout(weatherEngine.timeOut);
	document.getElementById("loading").className = "hidden";
	document.getElementById("location").className = "hidden";
	document.getElementById("unknownLoc").className = "visible";
	document.title = weatherEngine.title;
}

function updateFields() {
	var locationString;
	if(weatherEngine.city === weatherEngine.country) {
		// Handle city-states: only display the name of the city.
		locationString = weatherEngine.city;
	} else if(weatherEngine.state === weatherEngine.country || weatherEngine.state === "") {
		// Handle places where State is Country: display the city and country.
		locationString = weatherEngine.city + ", " + weatherEngine.country;
	} else {
		// Display the city, state, and country.
		locationString = weatherEngine.city + ", " + weatherEngine.state + ", " + weatherEngine.country;
	}
	var locationDiv = document.getElementById("youreIn");
	if(locationDiv.childNodes[1]) {
		// Remove the old location text.
		locationDiv.removeChild(locationDiv.childNodes[1]);
	}
	locationDiv.appendChild(document.createTextNode(locationString + "."));
	document.title = weatherEngine.title + " - " + locationString;
	weatherEngine.preferences.lastLocation = locationString;

	// Create the request to get the weather.
	weatherEngine.request = new weatherEngine.httpRequest();
	var unitsType = weatherEngine.preferences["celsius"] ? "\'c\'" : "\'f\'";
	var weatherURL = weatherEngine.weatherURL + weatherEngine.woeid + weatherEngine.weatherURL2 + unitsType + weatherEngine.weatherURL3;

	// Get the weather.
	// Again, this NEEDS to be before the request is sent.
	if(weatherEngine.isIE) {
		weatherEngine.request.onload = parseWeather;
	}
	weatherEngine.request.open("GET", weatherURL, false);
	weatherEngine.request.send(null);
	if(!weatherEngine.isIE) {
		parseWeather();
	}
}

function parseWeather() {
	weatherEngine.weatherResponse = JSON.parse(weatherEngine.request.responseText).query.results.channel;
	var weather = weatherEngine.weatherResponse;

	// Indicate the forecast time.
	document.getElementById("reportDate").innerHTML = "Accurate as of " + weather.item.pubDate + ". Click to refresh.";

	// Determine if it's hot out.
	var temperature = parseInt(weather.item.condition.temp);
	document.getElementById("hotColdHead").innerHTML = (temperature > weatherEngine.preferences.hotColdThreshold) ? "Hot" : "Cold";
	document.getElementById("hotColdContent").innerHTML = temperature + weather.units.temperature;

	// Determine if it's rainy/snowy.
	var condition = weather.item.condition.text;
	var rainShine;
	if(weatherEngine.rainyCodes.hasOwnProperty(weather.item.condition.code)) {
		rainShine = "Rain";
	} else if(weatherEngine.fauxRain.hasOwnProperty(weather.item.condition.code)) {
		rainShine = "\"Rain\"";
	} else if(weatherEngine.snow.hasOwnProperty(weather.item.condition.code)) {
		rainShine = "Snow";
	} else if(weatherEngine.trueShine.hasOwnProperty(weather.item.condition.code)) {
		rainShine = "Shine";
	} else {
		rainShine = "\"Shine\"";
	}
	document.getElementById("rainShineHead").innerHTML = rainShine;
	document.getElementById("rainShineContent").innerHTML = condition;

	// Determine if it's windy out.
	var windSpeed = parseFloat(weather.wind.speed);
	document.getElementById("windyStillHead").innerHTML = (windSpeed > weatherEngine.preferences.windyThreshold) ? "Windy" : "Still";
	document.getElementById("windyStillContent").innerHTML = windSpeed + " " + weather.units.speed;

	// Determine if it's humid out.
	var humidity = parseInt(weather.atmosphere.humidity);
	document.getElementById("humidAridHead").innerHTML = (humidity > weatherEngine.preferences.humidityThreshold) ? "Humid" : "Arid";
	document.getElementById("humidAridContent").innerHTML = humidity + "%";

	document.getElementById("loading").className = "hidden";
	document.getElementById("unknownLoc").className = "hidden";
	document.getElementById("settingsPane").className = "hidden";
	document.getElementById("location").className = "visible";
	weatherEngine.settingsPane.visible = false;
}