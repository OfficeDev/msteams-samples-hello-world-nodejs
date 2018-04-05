'use strict';

var express = require('express');
var app = express();

// Adding tabs to our app. This will setup routes to various views
var tabs = require('./tabs');
tabs.setup(app);

// Adding a bot to our app
var bot = require('./bot');
bot.setup(app);

// Adding a messaging extension to our app
var messagingExtension = require('./messaging-extension');
messagingExtension.setup();

// Deciding which port to use
var port = process.env.PORT || 3333;

// Start our nodejs app
app.listen(port, function() {
    console.log(`App started listening on port ${port}`);
});
