"use strict";
// NEW
import mp5 from './md5.js';

// DOM-ELEMENTS
const username = dom.$('#name');
const password = dom.$('#password');
const email = dom.$('#email');
const errElement = dom.$('#error');
const btnSend = dom.$('#btnSend');


// FUNCTIONS
// FUNCTION: Load data from Server
const loadDatas = () => {
    ajax.get('/loadDatas').then(
        data => checkUser(data)
    )
}

const checkUser = (data) => {
    let msg = [];

    // Validation for existing user
    const names = [];
    const emails = [];
    for (let i = 0; i < data.length; i++) {
        names.push(data[i].name);
        emails.push(data[i].email);
    }


    if (username.value != '' && names.includes(username.value)) {
        msg.push('The User name exists already')
    };
    if (email.value != '' && emails.includes(email.value)) {
        msg.push('The email exists already')
    };


    // Validation for password length
    if (password.value.length <= 5) {
        msg.push('Password must be longer than 6 characters');
    };
    if (password.value.length >= 15) {
        msg.push('Password must be less than 15 characters');
    };

    // Error Message
    if (msg.length > 0) {
        errElement.innerText = msg.join(', ');
        return;
    } else {
        registerUser();
    }
}


// FUNCTION: Save user in DB
const registerUser = () => {
    ajax.post('/registerUser', JSON.stringify({
        name: username.value,
        password: mp5(password.value),
        email: email.value
        // NEW
    })).then(
        alert('Registration completed, please login.')
    ).then(
        window.location = '/login'
    )
}

// EVENTLISTENER: Add New User
btnSend.addEventListener('click', loadDatas);
username.addEventListener('focus', () => { errElement.innerText = '' });
email.addEventListener('focus', () => { errElement.innerText = '' });
password.addEventListener('focus', () => { errElement.innerText = '' });