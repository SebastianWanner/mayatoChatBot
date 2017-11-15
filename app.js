var builder = require('botbuilder');
var restify = require('restify');
const path = require('path');
const winston = require('winston');
const fs = require('fs');

// Setup Restify Server
var server = restify.createServer();


// Create chatbot connector
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORDs
});


//create server
server.post('/api/messages', connector.listen());

//Serve a static web page
server.get(/.*/, restify.serveStatic({
      'directory': '.',
     'default': 'index.html'
}));

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//create Chatbot
var bot = new builder.UniversalBot(connector,
    function(session){
        session.preferredLocale('de', function(err){
            if (!err) {
                console.log("Locale: de");
            } else {
                console.log(err);
            }
        });

    });

// Set default locale
bot.set('localizerSettings', {
    botLocalePath: path.join(__dirname, './locale'),
    defaultLocale: 'de'
});
 
// Add global LUIS recognizer to bot 
var model = process.env.model || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/19fd82bb-c6a8-4ed7-ba2b-eabe2ff3edf5?subscription-key=6db68835a1ec41518c5ac8b77c8aea58&staging=true&verbose=true&timezoneOffset=0.0&q='; 
bot.recognizer(new builder.LuisRecognizer(model)); 

//Sends greeting message when the bot is first added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text("Hallo, ich bin Mike der Mayato ChatBot! Wie kann ich Ihnen behilflich sein? Sie können sich gerne über unsere Beratungsleistungen informieren oder zum Beispiel Case Studies ansehen.");
                bot.send(reply);
                //console.log(bot.preferredLocale());
            }
        });
    }
});

//=========================================================
// logger
//=========================================================
const logDir = __dirname + '/logs';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
const tsFormat = () => (new Date()).toLocaleTimeString();
const customLevels = {
    levels: {
      incoming: 0,
      outgoing: 1
    }
  };
const logger = new (winston.Logger)({
    exitOnError: false,
    levels: customLevels.levels,
    transports:[
        new (winston.transports.Console)({
            timestamp:tsFormat,
            colorize:true,
            level: 'error'
        }),
        new(require('winston-daily-rotate-file'))({
            filename: `${logDir}/-incoming.log`,
            name: 'incoming',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: 'incoming'
        }),
         new(require('winston-daily-rotate-file'))({
            filename: `${logDir}/-outcoming.log`,
            name: 'outgoing',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: 'outgoing'
        }) 
    ],
    exceptionHandlers:[
        new winston.transports.File({
            filename: `${logDir}/exceptions.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
        })
    ]
});


//Bot uses middleware for logging
bot.use({
    botbuilder: function(session, next){
        logger.incoming(session.message.text);
        //console.log('message: ' + session.message.text + ', user:' + session.message.user +  ', time: ' + session.message.timestamp);
        next();
    },

    send: function(event, next){
        logger.outgoing(event.text)
        //console.log('message: ' + event.text + ', user: ' + event.address.user.name);
        next();
    }
});
  

//=========================================================
// Sub-Dialogs
//=========================================================

bot.library(require('./Bot/dialogs/basicDialogs').createLibrary());
bot.library(require('./Bot/dialogs/company').createLibrary());
bot.library(require('./Bot/dialogs/customer').createLibrary());
bot.library(require('./Bot/dialogs/services').createLibrary());
