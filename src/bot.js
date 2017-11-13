/*jslint node: true */
'use strict';

var builder = require('botbuilder');
var teams = require('botbuilder-teams');

var connector = new teams.TeamsChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, function(session) {
    session.send("You said: %s", session.message.text);
});

exports.connector = connector;