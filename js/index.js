'use strict';

// DOM-ELEMENTS
const search = dom.$('#search');
const btn = dom.$('#btn');
const output = dom.$('#output');
const collapseMenu = dom.$('#collapse-menu');

const msgUser = dom.$('#msgUser');
const msgHome = dom.$('#msgHome');
const subnav = dom.$('#subnav');


// VARIABLES
let homeLocation = '';

// FUNKTIONS

// FUNKTION 1: get current Weather
function geoFindMe() {
    // return estimated address
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const geoUrl1 = 'https://nominatim.openstreetmap.org/search.php?q=';
        const geoUrl2 = '&polygon_geojson=1&accept-language=en&format=jsonv2';
        output.textContent = '';
        fetch(`${geoUrl1}${latitude}%2C%20${longitude}${geoUrl2}`, {
            mode: 'cors'
        }).then(
            data => data.json()
        ).then(
            data => parseCurrentlocation(data)
        )
    }

    function error() {
        output.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
        output.textContent = 'Geolocation is not supported by your browser';
    } else {
        output.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }

}

// FUNKTION 2: get weather JSON
const checkWeather = (currLocation = currLocation) => {
    // empty the output before postWeather
    output.innerText = '';
    // excute the function with current location while search.value is empty. 
    if (!search.value) { search.value = currLocation };
    const wRequest = new Request(
        '/weather',
        {
            method: 'post',
            body: JSON.stringify({
                city: search.value
            }),
            headers: { 'content-type': 'application/json' }
        }
    )
    fetch(wRequest).then(
        data => data.json()
    ).then(
        data => postWeather(data)
    ).catch(err => {
        output.innerHTML = "Oops, the city is not on earth. Pleaes try again.";
        const container = dom.$('#container');
        container.className = 'normal';
    }
    )
}

// FUNKTION 3: render Weather data on DOM
const postWeather = (data) => {
    // render Weather - Today
    const imgUrl = data[0].current.imageUrl;
    // render Weather - Forcast for 3 days
    const forecastData = data[0].forecast;
    dom.components.today(data, imgUrl);
    // render Weather - Forecast
    dom.components.forecast(forecastData);
    setBookmark();
}

const parseCurrentlocation = (data) => {
    let currLocArray = data[0].display_name.split(', '); // house no., str, area1, area2, 
    let currLocation = `${currLocArray[4]}, ${currLocArray[7]}`; // city, country
    checkWeather(currLocation);
}

// FUNKTION 4: Bookmark
const setBookmark = () => {
    const bookmark = dom.$('#bookmark');
    const currLocation = dom.$('#currLocation').innerText;
    //setBookmark(bookmark, currLocation);
    // check home Location, if equal 
    if (homeLocation == currLocation) {
        bookmark.classList.toggle('fa-heart-o');
        bookmark.classList.toggle('fa-heart');
    }

    bookmark.addEventListener('click', (evt) => {
        // only save home location while log-in
        if (sessionStorage.length == 0) {
            alert('Please log in to save the location.')
        } else if (homeLocation != currLocation) {
            evt.target.classList.toggle('fa-heart-o');
            evt.target.classList.toggle('fa-heart');
            homeLocation = currLocation;
            sessionStorage.setItem('homeLocation', currLocation)
            addLocation(currLocation);
            //console.log(homeLocation);
        } else {
            evt.target.classList.toggle('fa-heart-o');
            evt.target.classList.toggle('fa-heart');
            homeLocation = '';
            sessionStorage.removeItem('homeLocation');
            subnav.classList.add('display');
            removeLocation();
        }
        welcomeMsg();
    });
}

// FUNKTION : background changes regarding feedback
const changeBg = () => {
    const currTemp = dom.$('.currTemp');
    console.log(currTemp);
}

// FUNKTION 5 : Logout
const userLogout = () => {
    const logout = dom.$('#logout');
    logout.addEventListener('click', () => {
        sessionStorage.clear();
        welcomeMsg();
        setBookmark();
    })
}

// FUNKTION 6: msgUser varaiton for login user or guest
const showHome = () => {
    const home = dom.$('#home');
    home.addEventListener('click', () => {
        checkWeather(homeLocation);
    })
}

// FUNKTION 7: msgUser varaiton for login user or guest
const welcomeMsg = () => {
    const loginUser = sessionStorage.getItem('username');
    if (loginUser == null) {
        msgUser.innerHTML = '<a href="/login">Login</a> | <a href="/register">Sign up</a>';
    } else if (homeLocation !== null && homeLocation !== '') {
        subnav.classList.remove('display');
        msgUser.innerHTML = `<i class="fa fa-user-o" aria-hidden="true"></i> Hi, ${loginUser}. <a href="#" id="logout">Logout</a>`;
        msgHome.innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i> Home Location is: <a href="#" id="home">${homeLocation}</a>`;
        userLogout();
        showHome();
    } else {
        msgUser.innerHTML = `<i class="fa fa-user-o" aria-hidden="true"></i> Hi, ${loginUser}. <a href="#" id="logout">Logout</a>`;
        userLogout();
    }
}

// FUNKTION 8-1: Location checker
const checkHomeLocation = () => {
    homeLocation = sessionStorage.getItem('homeLocation');
    if (homeLocation !== null) {
        checkWeather(homeLocation);
    } else {
        geoFindMe();
    }
}
// FUNKTION 8-2: add home location
const addLocation = (loc) => {
    ajax.post('/addLocation', JSON.stringify({
        currentUserName: sessionStorage.getItem('username'),
        homeLocation: loc
    }))
}

// FUNKTION 8-3: remove home location
const removeLocation = (loc) => {
    ajax.post('/removeLocation', JSON.stringify({
        currentUserName: sessionStorage.getItem('username')
    }))
}


// EVENTLISTENER
search.addEventListener('focus', evt => {
    evt.target.value = 'city, country';
});

btn.addEventListener('click', () => {
    output.innerHTML = ''; // clear the previous output
    checkWeather(search.value);
    search.value = '';
});


// INIT
const init = () => {
    checkHomeLocation();
    welcomeMsg();
}

init();







