// ###############################################################################################################
// ###############################################################################################################
// ### FILE: bots.js                                                                                           ###
// ### AUTHOR: Dan Stevenson <dansteve@microsoft.com>                                                          ###
// ### LAST UPDATE: June 20, 2018                                                                              ###
// ### DESCRIPTION: Node.js app for NEO help bot                                                               ###
// ###############################################################################################################
// ###############################################################################################################
// ### CREDITS:                                                                                                ###
// ### https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-overview                   ###
// ### https://github.com/OfficeDev/BotBuilder-MicrosoftTeams/                                                 ###
// ### https://github.com/Microsoft/BotBuilder-Samples/                                                        ###
// ### https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/bots/bots-create                      ###
// ### https://www.luis.ai                                                                                     ###
// ###############################################################################################################
// ###############################################################################################################

'use strict';

module.exports.setup = function (app) {

// ####################################################
// Inits, constants, parameters

    var builder = require('botbuilder');
    var teams = require('botbuilder-teams');
    var config = require('config');
    var botConfig = config.get('bot');


// ####################################################
// Create a connector to handle the conversations

    var connector = new teams.TeamsChatConnector({
        appId: process.env.MICROSOFT_APP_ID || botConfig.microsoftAppId,
        appPassword: process.env.MICROSOFT_APP_PASSWORD || botConfig.microsoftAppPassword
    });


// ####################################################
// Router endpoint - always /api/messages
// ngrok is your friend and mind

    app.post('/api/messages', connector.listen());

    var inMemoryStorage = new builder.MemoryBotStorage();

// ####################################################
// Load LUIS recognizer
    var recognizer = new builder.LuisRecognizer(botConfig.LuisModelURL);
    bot.recognizer(recognizer);

// ####################################################
// Default message - calls sendHelpMessage

    var bot = new builder.UniversalBot(connector, function (session) {
        var helpMessage = sendHelpMessage(session, builder, session.message.text);
        session.send(helpMessage, session.message.text);
    }).set('storage', inMemoryStorage); // Register in memory storage

    

// ####################################################
// Handle "Help" intent from LUIS - calls sendHelpMessage

    bot.dialog('Help', function (session) {
        var helpMessage = sendHelpMessage(session, builder, session.message.text);
        session.send(helpMessage, session.message.text);
        session.endDialog();
    }).triggerAction({
        matches: 'Help'
    });


// ####################################################
// Send private welcome message to new users in team 
// Team has to have this app installed
// User can choose team or private chat with bot
// Uses adaptive card

    bot.dialog('Welcome', function (session) {
        session.send(new builder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://danspot.github.io/images/welcome.jpg",
                                                "size": "large",
                                                "style": "default"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Welcome, New Employee!",
                                                "weight": "bolder",
                                                "size": "large",
                                                "spacing": "medium"
                                            },
                                            {
                                                "spacing": "medium",
                                                "type": "TextBlock",
                                                "text": "I'm NEO, and I'm here to show you around.",
                                                "weight": "bolder",
                                                "wrap": true
                                            },
                                            {
                                                "type": "TextBlock",
                                                "size": "medium",
                                                "separator": "true",
                                                "text": "Get started by asking me some questions, like 'Who is my HR contact?'",
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }));
        session.endDialog();
    });


// ####################################################
// Handle "Badge" intent from LUIS
// Uses card carousel

    bot.dialog('Badge', function (session) {
        session.send("Try one of the options below for help with your security badge:")
        var badgeMessage = new builder.Message(session);
        badgeMessage.attachmentLayout(builder.AttachmentLayout.carousel);
        badgeMessage.attachments([
            new builder.ThumbnailCard(session)
                .title("Need a new badge?")
                .subtitle("Did you lose or break your badge?")
                .text("No problem - just contact Global Security with your phone number and employee ID number.")
                .images([builder.CardImage.create(session, 'https://danspot.github.io/images/badge-new.png')])
                .buttons([builder.CardAction.openUrl(session, 'sip:security@teamsftw.com', 'Chat with Global Security')]),
            new builder.ThumbnailCard(session)
                .title("Badge not working")
                .subtitle("Is your badge not working or do you need access to a special area?")
                .text("Contact Site Operations  with your employee ID, the 10-digit code on your badge, and the room code where you need access.")
                .images([builder.CardImage.create(session, 'https://danspot.github.io/images/badge-broken.png')])
                .buttons([builder.CardAction.openUrl(session, 'sip:security@teamsftw.com', 'Chat with Site Operations')]),
            new builder.ThumbnailCard(session)
                .title("Found someone's badge")
                .subtitle("Did you find someone else's badge lying around?")
                .text("Good for you! Please put it in the interoffice mail to Security.")
                .images([builder.CardImage.create(session, 'https://danspot.github.io/images/badge-found.png')]),
            new builder.ThumbnailCard(session)
                .title("Smartcard PIN reset")
                .subtitle("Did your PIN expire or does it need to be reset?")
                .text("Download the PIN reset tool below:")
                .images([builder.CardImage.create(session, 'https://danspot.github.io/images/badge-smartcard.png')])
                .buttons([builder.CardAction.openUrl(session, 'sip:security@teamsftw.com', 'Download PIN Reset Tool')])
        ]);
        session.endDialog(badgeMessage);
    }).triggerAction({
        matches: 'Badge'
    });


// ####################################################
// Handle "Handbook" intent from LUIS
// Uses adaptive card with button and input

    bot.dialog('Handbook', function (session) {
        session.send(new builder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://danspot.github.io/images/hr-book.png",
                                                "size": "large",
                                                "style": "default"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Employee Handbook",
                                                "weight": "bolder",
                                                "size": "large",
                                                "spacing": "medium"
                                            },
                                            {
                                                "separator": "true",
                                                "spacing": "medium",
                                                "type": "TextBlock",
                                                "text": "Employee Policies, Behavior, & Work Environment",
                                                "weight": "bolder",
                                                "wrap": true
                                            },
                                            {
                                                "type": "TextBlock",
                                                "size": "small",
                                                "text": "Last updated {{DATE(2018-06-17T16:08:39Z, SHORT)}}",
                                                "isSubtle": true,
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Review this handbook carefully, and discuss any questions or suggestions you may have with your manager or your Human Resources representative.",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "This handbook does not constitute a contract or change the at-will nature of your employment. This handbook, and the other sites it links to, contain general guidelines only.",
                                "weight": "bolder",
                                "size": "small",
                                "wrap": true
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.ShowCard",
                        "title": "Confirm Acceptance of Terms",
                        "card": {
                            "type": "AdaptiveCard",
                            "body": [
                                {
                                    "type": "Input.Text",
                                    "id": "comment",
                                    "isMultiline": false,
                                    "placeholder": "Enter your full legal name"
                                }
                            ],
                            "actions": [
                                {
                                    "type": "Action.OpenUrl",
                                    "title": "I Accept",
                                    "url": "https://teamsftw1.sharepoint.com/SitePages/Employee-Handbook.aspx"
                                }
                            ]
                        }
                    }
                ]

            }
        }));
        session.endDialog();
    }).triggerAction({
        matches: 'Handbook'
    });


// ####################################################
// Handle "Handbook" intent from LUIS
// Uses adaptive card with URL button to start new chat

    bot.dialog('Contact', function (session) {
        session.send(new builder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",


                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Your HR contact is Nestor Wilke",
                                                "weight": "bolder",
                                                "size": "medium",
                                                "spacing": "medium"
                                            },
                                            {
                                                "separator": "true",
                                                "spacing": "medium",
                                                "type": "TextBlock",
                                                "text": "nestor@teamsftw.com",
                                                "weight": "bolder",
                                                "wrap": true
                                            },
                                            {
                                                "type": "TextBlock",
                                                "size": "small",
                                                "text": "555-555-5555",
                                                "isSubtle": true,
                                                "wrap": true
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://danspot.github.io/images/nestor.jpg",
                                                "size": "medium",
                                                "style": "person"
                                            }
                                        ]
                                    }

                                ]
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "Start Chat",
                        "url": "sip:nestor@teamsftw.com"
                    }

                ]

            }
        }));
        session.endDialog();
    }).triggerAction({
        matches: 'Contact'
    });


// ####################################################
// Detect roster updates
// If bot is new user, send simple welcome message
// If other user is new, start private message
// (see 'Welcome' above)

    bot.on('conversationUpdate', (msg) => {
        var members = msg.membersAdded;
        // Loop through all members that were just added to the team
        for (var i = 0; i < members.length; i++) {
            console.log(members[i].id);
            // See if the member added was our bot
            if (members[i].id.includes(botConfig.microsoftAppId)) {
                bot.send(new builder.Message()
                .address(msg.address)
                .addAttachment(new builder.HeroCard()
                    .title('Welcome, New Employees!')
                    .subtitle('We\'re so glad you\'re here!')
                    .text('My name is <b>NEO</b> and I\'m here to answer questions and help you figure things out. Start by asking me something, like \"Where is the cafeteria?\".\n\nHave a private question for me? Just send me a direct chat message and I\'ll do my best to help.')
            ))
            } else {
                var userId = members[i].id;
                var address =
                {
                    channelId: 'msteams',
                    user: { id: userId },
                    channelData: {
                        tenant: {
                            id: 'af10ba87-b9e9-4761-9c88-cdcdc651b07c'
                        }
                    },
                    bot:
                    {
                        id: botConfig.microsoftAppId,
                        name: botConfig.microsoftAppName
                    }, 
                    serviceUrl: msg.address.serviceUrl,
                    useAuth: true
                };
                bot.beginDialog(address,'Welcome')
            }
        }
    });


// ####################################################
// Spell Check

    if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
        bot.use({
            botbuilder: function (session, next) {
                spellService
                    .getCorrectedText(session.message.text)
                    .then(function (text) {
                        console.log('Text corrected to "' + text + '"');
                        session.message.text = text;
                        next();
                    })
                    .catch(function (error) {
                        console.error(error);
                        next();
                    });
            }
        });
    }

    // Export the connector for any downstream integration - e.g. registering a messaging extension
    module.exports.connector = connector;
};


// ####################################################
// Help message sent for 'None' and 'Help' intents from LUIS
// Contains original message repeated inline (hence JSON edits)

function sendHelpMessage(session, builder, queryText) {
    var helpMessageJSON = {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",

            "body": [
                {
                    "type": "TextBlock",
                    "text": "Hmmm... not sure what that means. Let's get someone to help!",
                    "size": "large",
                    "wrap": "true"
                },
                {
                    "type": "TextBlock",
                    "text": "Tell us a little more about what you want to know...",
                    "size": "medium",
                    "separator": "true",
                    "spacing": "large"
                },
                {
                    "type": "Input.Text",
                    "id": "HRquestion",
                    "isMultiline": "true",
                    "value": "TEXTHERE999"
                },
                {
                    "type": "TextBlock",
                    "text": "What general category are you asking about?",
                    "size": "medium",
                    "spacing": "large"
                },
                {
                    "type": "Input.ChoiceSet",
                    "id": "category",
                    "style": "compact",
                    "value": "1",
                    "choices": [
                        {
                            "title": "Handbook and policies",
                            "value": "1"
                        },
                        {
                            "title": "Benefits",
                            "value": "2"
                        },
                        {
                            "title": "Time off",
                            "value": "3"
                        },
                        {
                            "title": "Compensation",
                            "value": "4"
                        },
                        {
                            "title": "Workplace issues",
                            "value": "5"
                        },
                        {
                            "title": "Training",
                            "value": "6"
                        },
                        {
                            "title": "Other",
                            "value": "7"
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": " ",
                    "size": "medium",
                    "separator": "true"
                }
            ],
            "actions": [
                {
                    "type": "Action.ShowCard",
                    "title": "Ask HR",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "TextBlock",
                                "text": "Your question was sent!",
                                "size": "small",
                                "separator": "true"
                            }
                        ]
                    }
                }
            ]
        }
    };
    var helpMessageJSONString = JSON.stringify(helpMessageJSON);
    queryText = queryText.replace('<at>NEO</at> ','');
    queryText = queryText.replace(/(\r\n|\n|\r)/gm,'');
    helpMessageJSONString = helpMessageJSONString.replace('TEXTHERE999',queryText);
    console.log(helpMessageJSONString);
    var updatedHelpMessageJSON = JSON.parse(helpMessageJSONString);
    var helpMessage = new builder.Message(session).addAttachment(updatedHelpMessageJSON);
    return helpMessage;
}
