"use strict";

import mp5 from './md5.js';

// DOM-ELEMENTS
const username = dom.$('#username');
const password = dom.$('#password');

const errElement = dom.$('#error');
const btnSend = dom.$('#btnSend');

// FUNCTIONS
// FUNCTION: Load data from Server
const loadDatas = () => {
    ajax.get('/loadDatas').then(
        data => checkUser(data)
    )
}

// FUNCTION: check whether the user is in DB. If so, redirect
const checkUser = (data) => {
    let msg = [];

    // Validation for existing user
    const names = [];
    const users = data;
    for (let i = 0; i < data.length; i++) {
        names.push(data[i].name);
    }

    let index = names.indexOf(username.value);

    if (index == -1) {
        msg.push('The User does not exists');
    }
    else if (index != -1 && mp5(password.value) != users[index].password) {
        msg.push('Wrong password');
    }

    // Error Message
    if (msg.length > 0) {
        errElement.innerText = msg.join(', ');
        return;
    } else {
        //User info is Correct, redirect 
        loginUser(data[index]);
    }
}

// FUNCTION: Redirect to weather page and save the current user data in session storage
const loginUser = (userdata) => {
    console.log(userdata);
    sessionStorage.setItem('username', userdata.name)
    //sessionStorage.setItem('password', mp5(userdata.password))
    if (userdata.homeLocation !== undefined) {
        sessionStorage.setItem('homeLocation', userdata.homeLocation)
    }
    window.location = '/';
}

// EVENTLISTENER:
btnSend.addEventListener('click', loadDatas);
username.addEventListener('focus', () => { errElement.innerText = '' });
password.addEventListener('focus', () => { errElement.innerText = '' });

