/*jslint node: true */
'use strict';

module.exports.setupTabs = function(app) {
    var path = require('path');
    
    // Configure the view engine and views folder
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
