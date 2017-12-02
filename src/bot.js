'use strict';

var builder = require('botbuilder');
var teams = require('botbuilder-teams');
var config = require('config');

var botConfig = config.get('bot');

var connector = new teams.TeamsChatConnector({
    appId: botConfig.microsoftAppId,
    appPassword: botConfig.microsoftAppPassword
});

var bot = new builder.UniversalBot(connector, function(session) {
    session.send('You said: %s', session.message.text);
});

exports.connector = connector;