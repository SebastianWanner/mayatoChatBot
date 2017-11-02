var builder = require('botbuilder');
var restify = require('restify');

var chatbotStrings = require('./mayatoChatbot-strings.js');

'use strict';
const winston = require('winston');
const fs = require('fs');

//create Azure DocumentDB 
//var DocumentDBClient = require('documentdb').DocumentClient;
//var BotStorage = require('./models/botStorage');
//var DocDbClient = require('./models/docDbClient');

//var config = require('./config');

// Setup Restify Server
var server = restify.createServer();


// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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




var bot = new builder.UniversalBot(connector, function (session) { 
     session.send("Sorry, Ich konnte die Eingabe leider nicht verstehen. Bitte schreiben Sie \'Hilfe\' für mehr Informationen"); 
 });

 // Set default locale
bot.set('localizerSettings', {
    botLocalePath: './locale',
    defaultLocale: 'de'
})
 
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
                    .text(chatbotStrings.greeting);
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
// Database
//=========================================================


/* 
var azureClient = new DocumentDBClient(config.host, {
    masterKey: config.masterKey
});


var docDbClient = new DocDbClient(azureClient, config.databaseId, config.collectionId);
var botStorage = new BotStorage(docDbClient); 

docDbClient.init();*/

/*function function1(){
    botStorage.getAnswerByIntent("Data Science", function (err, results) {
             if (err) {
                 throw (err);
             }

             // bla bla bla
             //return the results
            console.log(results);

         });
}

*/


//setTimeout(function1, 5000);


  

//=========================================================
// Sub-Dialogs
//=========================================================

bot.library(require('./Bot/dialogs/basicDialogs').createLibrary());
bot.library(require('./Bot/dialogs/company').createLibrary());
bot.library(require('./Bot/dialogs/customer').createLibrary());
bot.library(require('./Bot/dialogs/services').createLibrary());

//=========================================================
// None
//=========================================================

bot.dialog('None', 
    function(session, args){    
        session.send("Leider hab ich Sie nicht verstanden. Ich glaube, ich muss mal mit meinem Entwickler reden");
        session.send("Schreiben Sie Hilfe um mehr über mich zu erfahren.")

    }
);


//=========================================================
// GetHelp
//=========================================================

bot.dialog('getHelp', 
    function(session, args){    
        session.send("Kommst du nicht weiter? Suche noch mal nach Case Studies");

    }
).triggerAction({
    matches:'getHelp'
});
