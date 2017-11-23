// This loads the environment variables from the .env file
require('dotenv-extended').load();
console.log(process.env.APP_ID);

// loads the microsoft bot framework
var builder = require('botbuilder');
//loads server library
var restify = require('restify');
const path = require('path');
const fs = require('fs');
//loads logging framework
const winston = require('winston');

// Setup Restify Server
var server = restify.createServer();

// Create chatbot connector
var connector = new builder.ChatConnector({
    appId: 'APP_ID',
    appPassword: 'APP_PASSWORD'

});

//create server
server.post('/api/messages', connector.listen());

//Serve a static web page
server.get(/.*/, restify.serveStatic({
      'directory': '.',
     'default': 'index.html'
}));

//server listening
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//create Chatbot
var bot = new builder.UniversalBot(connector, {
    localizerSettings: {
        botLocalePath: path.join(__dirname, './locale'),
        defaultLocale: 'de'
    }
});

// Enable Conversation Data persistence
bot.set('persistConversationData', true);
 
// Add global LUIS recognizer to bot 
var model = process.env.model || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/19fd82bb-c6a8-4ed7-ba2b-eabe2ff3edf5?subscription-key=6db68835a1ec41518c5ac8b77c8aea58&staging=true&spellCheck=true&verbose=true&timezoneOffset=0&q='; 
bot.recognizer(new builder.LuisRecognizer(model)); 

//Sends greeting message when the bot is first added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text("Hallo, ich bin Mike der mayato ChatBot.\n\n Du kannst mir einfache Fragen über mayato stellen. \n\n Zum Beispiel: Welche Beratungsleistungen wir anbieten oder suche doch einfach mal nach Case Studies.");           
                    bot.send(reply);
                
                var reply = new builder.Message()
                .address(message.address)
                .text("Ich bin nur ein Bot, aber ich werde dir antworten, so gut ich kann. ");
                bot.send(reply);
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
            filename: `${logDir}/-console_exceptions.log`,
            name: 'console_exceptions',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
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
