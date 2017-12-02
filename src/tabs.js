'use strict';

module.exports.setup = function(app) {
    var path = require('path');
    var express = require('express')
    
    // Configure the view engine, views folder and the statics path
    app.use(express.static(path.join(__dirname, 'static')));
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));
    
    // Setup home page
    app.get('/', function(req, res) {
        res.render('hello');
    });
    
    // Setup the static tab
    app.get('/hello', function(req, res) {
        res.render('hello');
    });
    
    // Setup the configure tab, with first and second as content tabs
    app.get('/configure', function(req, res) {
        res.render('configure');
    });    

    app.get('/first', function(req, res) {
        res.render('first');
    });
    
    app.get('/second', function(req, res) {
        res.render('second');
    });    
};
