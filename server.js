"use strict";
// MODULES
const express = require("express");
const weather = require('weather-js');
const db = require('nano')('http://admin:F646M67Pn3VbaYm@localhost:5984').db;

const dbName = "users"
const server = express();


// MIDDLEWARE
server.use(express.static('public', {
    extensions: ['html']
}));

// PROCESS JSON DATA
server.use(express.json());

// REDIRECT: login/register/index
server.get('/', (req, res) => {
    res.redirect('index.html')
});

server.get('/login', (req, res) => {
    res.redirect('login.html')
});

// Register
server.get('/register', (req, res) => {
    res.redirect('register.html')
});

// FUNKTION 1: Add User in DB
server.post('/registerUser', (req, res) => {
    return db.list().then(
        data => {
            if (data.includes(dbName)) return true;
            else return db.create(dbName);
        }
    ).then(
        () => db.use(dbName)
    ).then(
        db => db.insert(req.body)
    )
})


// FUNKTION 2 : Load Weather data as json / , degreeType: 'C'  can be deleted
server.post('/weather', (req, res) => {
    weather.find({ search: req.body.city, degreeType: 'C' }, function (err, result) {
        if (err) res.send(err);
        res.send(JSON.stringify(result, null, 2));
    });
})


// FUNKTION 3: Load user data
const loadDatas = () => {
    return db.list().then(
        data => {
            if (data.includes(dbName)) return true;
            else return db.create(dbName);
        }
    ).then(
        () => db.use(dbName)
    ).then(
        data => data.list({ include_docs: true })
    ).then(
        data => data.rows.map(el => el.doc)
    ).catch(
        console.log
    )
}

server.get('/loadDatas', (req, res) => {
    loadDatas().then(
        data => res.send(JSON.stringify(data))
    ).catch(
        console.log
    )
})

// FUNKTION 4: Add home location
server.post('/addLocation', (req, res) => {
    let dblocal;
    return db.list().then(
        () => dblocal = db.use(dbName)
    ).then(// find the current user data on couchDB
        () =>
            dblocal.find({
                selector: {
                    name: req.body.currentUserName
                }
            })
    ).then(// add the savedLocation and 
        data => {
            const obj = { ...data.docs[0] }; // copy an object (shallow)
            obj.homeLocation = req.body.homeLocation;
            dblocal.insert(obj); // dblocal need to be valid within this function, therefore line 87
        }
    ).catch(
        console.log
    )
})

// FUNKTION 5: Remove home location
server.post('/removeLocation', (req, res) => {
    let dblocal;
    return db.list().then(
        () => dblocal = db.use(dbName)
    ).then(// find the current user data on couchDB
        () =>
            dblocal.find({
                selector: {
                    name: req.body.currentUserName
                }
            })
    ).then(// add the savedLocation and 
        data => {
            const obj = { ...data.docs[0] }; // copy an object (shallow)
            delete obj['homeLocation'];
            dblocal.insert(obj);
        }
    ).catch(
        console.log
    )
})


// INIT 
const init = () => {
    server.listen(80, err => {
        if (err) console.log(err);
        else console.log("Server is ready");
    });
}

init();


/*
res.send(temp)
temp is number, it will be regarded as server status in response
therefore i need to res.send(String(temp)) to make it clear.
*/
