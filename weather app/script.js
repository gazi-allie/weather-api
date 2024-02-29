const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weaather-container");

const grantAccessCont = document.querySelector(".grant-loc-con");
const searchForm = document.querySelector("[data-searchForm]");
const loadingCon = document.querySelector(".loading-container");
const userInfo = document.querySelector(".user-info");
const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

const API = "7bf36363f3f104c08e03dd72101dc3d4";

let currTab = userTab;
currTab.classList.add("current-tab");
getfromSessionStorage();

// /adding event on the tabs between user and search

function switchTab(clickedTab) {
    notFound.classList.remove("active");
    if (currTab != clickedTab) {
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");


        if (!searchForm.classList.contains("active")) {
            userInfo.classList.remove("active");
            grantAccessCont.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfo.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab)
});

function getfromSessionStorage() {
    const localCord = sessionStorage.getItem("user-coordinates");
    if (!localCord) {
        grantAccessCont.classList.add("active");

    } else {
        const coordinates = JSON.parse(localCord);
        fetchUserWeather(coordinates);
    }
}
async function fetchUserWeather(coordinates) {
   const { lat, lon } = coordinates;
    grantAccessCont.classList.remove("active");
    loadingCon.classList.add("active");
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        const data = await res.json();
        if (!data.sys) {
            throw data;
        }
        loadingCon.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingCon.classList.remove("active");
        notFound.classList.remove("active");
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchUserWeather);

    }
}
function renderWeatherInfo(weatherInfo) {
    //    fertch elements // 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryFlag]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weathrIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-wind]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloud]");
    // fetch values of the city
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weathrIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else {
        // error
        grantAccessBtn.style.display = 'none';
    }
}

function showPosition(position) {
    const userCordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCordinates))
    fetchUserWeather(userCordinates)
}
const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getlocation);
// search city
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchInput.value;
    if (city === "") { return; }
    else
        fetchSearchWeatherInfo(city);
    searchInput.value = "";
});

async function fetchSearchWeatherInfo(city) {
    loadingCon.classList.add("active");
    userInfo.classList.remove("active");
    notFound.classList.remove("active");
    grantAccessCont.classList.remove("active");
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`
        );
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingCon.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingCon.classList.remove('active');
        userInfo.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
    }

}