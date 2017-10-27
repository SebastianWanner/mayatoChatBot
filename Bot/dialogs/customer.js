
var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");

var lib = new builder.Library('customer');
var config = require('../../config');

/*
var BotStorage = require("../../models/botStorage");
var DocDbClient = require("../../models/docDbClient");
var DocumentDBClient = require('documentdb').DocumentClient;
var azureClient = new DocumentDBClient(config.host, {
    masterKey: config.masterKey
});*/

//var docDbClient = new DocDbClient(azureClient, config.databaseId, config.collectionId);
//var botStorage = new BotStorage(docDbClient);
//docDbClient.init();

var JSONStorage = require("../../models/JSONStorage.js");

var botStorage = new JSONStorage();

var departments = ["customer analytics", "financial analytics", "industry analytics", "it operations analytics", "technology"];

//=========================================================
// Get Customer
//=========================================================

lib.dialog('getCustomer', [

    function(session, args){

        session.send('Mayato betreut Kunden aus vielen Branchen wie der Automotive-, Bank- oder Industrie-Branche');
        session.send('Hier eine Auswahl von Kunden, welche mit Mayato zusammengearbeitet haben.');



        session.send('Tipp: Sie können auch nach Case-Studies suchen');

        //builder.Prompts.confirm(session, "Wollen Sie sich auch Case Studies ansehen?");

    },

    function (session, results){
        if(results.response){
            session.beginDialog('CaseStudies')
        }
    }
]).triggerAction({
    matches:'getCustomer'
});

//=========================================================
// Get Case Studies
//=========================================================

lib.dialog('getCaseStudies', [

    function(session, args, next){
        var competence = builder.EntityRecognizer.findEntity(args.intent.entities, 'competence');

        if(competence){
            next({ response: competence});
        }else{
            builder.Prompts.choice(session, "Zu welchen Themen wollen Sie sich Case Studies anschauen?", departments, { listStyle: builder.ListStyle.button } ); 
        }

           
    },

    function (session, results){
        var competence = results.response.entity;

        if (competence){
            
            var cards = [];
            botStorage.getAnswerByIntentAndTag("getCaseStudies", competence,  function (err, dbResults) {
                if (err) {
                    console.log(err);
                    throw (err);
                }else{
                    if(dbResults.length === 0){
                        session.send("Leider haben wir keine Case Studies gefunden")
                    }else{
                        console.log(dbResults);

                        for(var item of dbResults){
                            var card =  new builder.HeroCard(session)
                                .title(item.title)
                                .text(item.company)
                                .images([
                                   builder.CardImage.create(session, item.image)
                                ])
                                .buttons([
                                    builder.CardAction.openUrl(session, item.url, "Bitte hier klicken")
                            ]);

                            cards.push(card)
                        }
                    }
                }
            });

            if(cards){

                session.send('Hier eine Auswahl von Case Studies im Bereich' + botUtils.toProperCase(competence))

                var message = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);

                session.send(message);
            }
        }
    }
]).triggerAction({
    matches:'getCaseStudies'
});

//=========================================================
// Get Contact Person
//=========================================================

lib.dialog('getContactPerson', [

    function(session, args, next){
        var competence = builder.EntityRecognizer.findEntity(args.intent.entities, 'competence');

        if(competence){
            next({ response: competence});
        }else{
                builder.Prompts.choice(session, "Wählen Sie einen Bereich aus.", departments, {listStyle: builder.ListStyle.button}, {maxRetries: 2});
            }
    },

    function(session, results, next){
        var competence = results.response.entity;

        if (competence){
            session.sendTyping;

            botStorage.getAnswerByIntentAndTag("getContactPerson", competence, function (err, dbResults) {
                if (err) {
                    console.log(err);
                    throw (err);
                }else{
                    if(dbResults.length === 0){
                        session.send("Leider wurde kein Ansprechpartner gefunden")

                    }else{
                        session.send("Ihr Ansprechpartner im Bereich %s ist:", botUtils.toProperCase(competence));

                        var contactCard = new builder.HeroCard(session);
                        contactCard.title(dbResults[0].name);
                        contactCard.text("Tel.: %s \n E-Mail: %s", dbResults[0].phone, dbResults[0].email);
                        contactCard.images([
                           builder.CardImage.create(session, dbResult[0].image)
                        ])
                        var message = new builder.Message(session).addAttachment(contactCard);
                        session.endDialog(message);
                        
                    }
                }
            });
        }
    },
        

]).triggerAction({
    matches:'getContactPerson'
});

module.exports.createLibrary = function(){
    return lib.clone();
}

