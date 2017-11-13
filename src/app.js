/*jslint node: true */
'use strict';

var path = require('path');
var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
    res.render('hello');
});

app.get('/hello', function(req, res) {
    res.render('hello');
});

app.get('/first', function(req, res) {
    res.render('first');
});

app.get('/second', function(req, res) {
    res.render('second');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/configure', function(req, res) {
    res.render('configure');
});

// Adding a bot to our app
var bot = require('./bot');
app.post('/api/messages', bot.connector.listen());

app.listen(process.env.PORT || 3333, function() {
    console.log('App started listening on port 3333');
});