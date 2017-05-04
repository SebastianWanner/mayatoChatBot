var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();


//departments of mayato
var departments = ["customer analytics", "financial analytics", "industry analytics", "it operations analytics", "data science", "technology", "training"];

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Create connector for debug
//var connector = new builder.ConsoleConnector().listen();

server.post('/api/messages', connector.listen());

// Serve a static web page
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
    defaultLocale: 'en'
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
                    .text("Hallo, ich bin Mike der Mayato ChatBot! Wie kann ich Ihnen behilflich sein?");
                bot.send(reply);
            }
        });
    }
});

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
        session.send("Ich kann dir helfen alles über Mayato herauszufinden. Frag mich zum Beispiel Welchen Service die Mayato GmbH anbietet? Oder in welchen Bereichen wir für unsere Kunden IT-Lösungen anbieten.");

    }
).triggerAction({
    matches:'getHelp'
});
