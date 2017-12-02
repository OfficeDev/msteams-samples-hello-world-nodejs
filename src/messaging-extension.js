'use strict';

module.exports.setup = function() {
    var builder = require('botbuilder');
    var teamsBuilder = require('botbuilder-teams');
    var bot = require('./bot');

    bot.connector.onQuery('getRandomText', function(event, query, callback) {
        var faker = require('faker');

        // If the user supplied a title via the cardTitle parameter then use it or use a fake title
        var title = query.parameters && query.parameters[0].name === 'cardTitle'
            ? query.parameters[0].value
            : faker.lorem.sentence();

        // Build the data to send
        var attachments = [];

        // Generate 5 results to send with fake text and fake images
        for (var i = 0; i < 5; i++) {
            attachments.push(
                new builder.ThumbnailCard()
                    .title(title)
                    .text(faker.lorem.paragraph())
                    .images([new builder.CardImage().url(faker.image.image())])
                    .toAttachment());
        }

        // Build the response to be sent
        var response = teamsBuilder.ComposeExtensionResponse
            .result('list')
            .attachments(attachments)
            .toResponse();

        // Send the response to teams
        callback(null, response, 200);
    });
};
