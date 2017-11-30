/*jslint node: true */
'use strict';

var express = require('express');
var app = express();

// Adding tabs to our app. This will setup routes to various views
var tabs = require('./tabs');
tabs.setupTabs(app);

// Adding a bot to our app
var bot = require('./bot');
app.post('/api/messages', bot.connector.listen());

// Adding a messaging extension to our app
var messagingExtension = require('./messaging-extension');
messagingExtension.setupQueryHandler();

// Start our nodejs app
app.listen(process.env.PORT || 3333, function() {
    console.log('App started listening on port 3333');
});