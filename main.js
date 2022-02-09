window.onload = () => {
  
  // create stat objects
  addStat("Current Temp");
  addStat("High");
  addStat("Low");
  addStat("Feels Like");
  addStat("Humididty");
  addStat("Wind Speed");
  addStat("Sunrise");
  addStat("Sunset");
  
  // object containing all te DOM elements
  const elements = {
    root: document.querySelector(":root"),
    temperature: document.querySelector(".card .top .labels h1"),
    dateInfo: document.querySelectorAll(".card .top .labels .date h3"), // array containing DOW and date
    description: document.querySelector(".card .stats .stat h2"),
    stats: document.querySelectorAll(".card .stats .stat .red"), // array containing all of the stats
    bgImg: document.querySelector(".card .top")
  };
  
  getData(elements);
  setInterval(() => { getData(elements) }, 60000);
  
};

function getData(elms) {
  function gotPosition(position) {
    let {longitude, latitude} = position.coords;
    
    // fetch weather data based on curent location
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1a63b31fa752648c49caa682197af3d8&units=imperial`)
  		.then(res => res.json())
  		.then(data => update(data, elms))
  	  .catch(error => failure);
  }
  
  function failure(error) {
    alert("Unable to get data, please try again later.");
  }
  
  // get the users current location
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(gotPosition, failure);
  else alert("Your browser does not support geolocation.");

}

function addForcastBlock(time, temp) {
  document.querySelector(".forcast").innerHTML += `
    <div class="forcast-block">
	          <h3>${time}</h3>
	          <p>Sun</p>
	          <p>${temp}</p>
	        </div>
  `;
}

function addStat(label, text) {
  document.querySelector(".stats").innerHTML += `
    <div class="stat">
	        <div class="left">${label}</div>
	        <div class="red">-</div>
	      </div>
  `;
}

function formatTime(date) {
  
  let h = (date.getHours() + 12) % 12;
  let m = "0" + date.getMinutes();
  return h + ":" + m.substr(-2);
  
}

function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function update(data, elms) {
  let date = new Date();
  let currentDate = formatDate(date);
  let sunrise = formatTime(new Date(data.sys.sunrise * 1000)),
      sunset = formatTime(new Date(data.sys.sunset * 1000));
  let backgroundInfo = getBGInfo(data);

	elms.temperature.innerText = Math.round(data.main.temp);
	elms.dateInfo[0].innerText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
	elms.dateInfo[1].innerText = currentDate;
	elms.description.innerText = data.weather[data.weather.length - 1].description;
	elms.stats[0].innerText = Math.round(data.main.temp) + " F";
	elms.stats[1].innerText = Math.round(data.main.temp_max) + " F";
	elms.stats[2].innerText = Math.round(data.main.temp_min) + " F";
	elms.stats[3].innerText = Math.round(data.main.feels_like) + " F";
	elms.stats[4].innerText = data.main.humidity + "%";
	elms.stats[5].innerText = data.wind.speed + " MPH";
	elms.stats[6].innerText = sunrise + " AM";
	elms.stats[7].innerText = sunset + " PM";
  elms.root.style.setProperty("--accent-color", backgroundInfo.bgColor);
  elms.bgImg.style.setProperty("background-image", `url(${backgroundInfo.bgImgSrc})`);
}


function getBGInfo(data) {
  
  switch(data.weather[data.weather.length - 1].main) {
		case "Rain":
			return {
			  bgImgSrc: "./assets/julian-cardenas-c62eiLfzBC8-unsplash.jpg",
			  bgColor: "#77aeeb"
			};
			
		case "Mist":
		case "Fog":
		  return {
		    bgImgSrc: "./assets/khamkeo-vilaysing-WtwSsqwYlA0-unsplash.jpg",
			  bgColor: "#126a2a"
		  };

		case "Clear":
			return {
			  bgImgSrc: "./assets/jorg-bauer-HirOEl-PGak-unsplash.jpg",
			  bgColor: "#77aeeb"
			};

		case "Clouds":
			return {
			  bgImgSrc: "./assets/kyle-glenn-SrASYZZpyjw-unsplash.jpg",
			  bgColor: "#126a2a"
			};
			
		// case "Snow":
		  
	}
	
	return {
		bgImgSrc: "./assets/jorg-bauer-HirOEl-PGak-unsplash.jpg",
		bgColor: "#77aeeb"
	};
	
}