
//loads microsoft bot framwork
var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");

//creates library for exporting
var lib = new builder.Library('customer');

//loads JSON Data Storage
var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var timeout = 5000;


//=========================================================
// Intent Get Customer
//=========================================================

lib.dialog('getCustomer', [

    function(session, args){

        var cards = [];
        botStorage.getAnswerByIntent("getCustomer", function (err, dbResults) {
            if (err) {
                console.log(err);
                throw (err);
            }else{
                if(dbResults.length === 0){
                    session.send(session.localizer.gettext(session.preferredLocale(), "getCustomerNoResult"));
                }else{
                    console.log(dbResults);

                    for(var item of dbResults){
                        var card =  new builder.HeroCard(session)
                            .title(item.customer)
                            .subtitle(item.sector)
/*                             .images([
                               builder.CardImage.create(session, item.logo)
                            ]) */

                        cards.push(card)
                    }
                }
            }
        });

        if(cards){

            session.sendTyping();
            setTimeout(function () {
                session.send(session.localizer.gettext(session.preferredLocale(), "getCustomer"));
            }, timeout);   
        

            var message = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);

            session.send(message);
        }

        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "tipCaseStudies"));
            session.endDialog();
        }, timeout);   
    }

]).triggerAction({
    matches:'getCustomer'
});

//=========================================================
// Intent Get Case Studies
//=========================================================

lib.dialog('getCaseStudies', [

    function(session, args, next){
        var competence = builder.EntityRecognizer.findEntity(args.intent.entities, 'competence');

        if(competence){
            next({ response: competence});
        }else{
            session.sendTyping();
            setTimeout(function () {
                builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "questionCaseStudies"), session.localizer.gettext(session.preferredLocale(), "departments"), { listStyle: builder.ListStyle.button } );  
            }, timeout);   
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
                        session.send(session.localizer.gettext(session.preferredLocale(), "questionCaseStudies"));
                        session.replaceDialog('getCaseStudies')
                    }else{
                        console.log(dbResults);


                        for(var item of dbResults){
                            var card =  new builder.HeroCard(session)
                                .title(item.company)
                                .subtitle(item.title)
                                .text(item.text)
                                .images([
                                   builder.CardImage.create(session, item.image)
                                ])
                                .buttons([
                                    builder.CardAction.openUrl(session, item.url, session.localizer.gettext(session.preferredLocale(), "click_here"))
                            ]);

                            cards.push(card)
                        }
                    }
                }
            });

            if(cards){

                session.sendTyping();
                setTimeout(function () {
                    session.send(session.localizer.gettext(session.preferredLocale(), "caseStudiesSelection"), botUtils.toProperCase(competence))
                }, timeout); 
                

                var message = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);

                session.sendTyping();
                setTimeout(function () {
                    session.send(message);
                    session.endDialog();
                }, timeout); 

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
        var contactPerson = builder.EntityRecognizer.findEntity(args.intent.entities, 'contactPerson');

        if(competence){
            //competence entity detected, continue to next step
            session.dialogData.searchType = 'competence';
            next({ response: competence});
        } else if(contactPerson){
            //contactPerson entity detected, continue to next step
            session.dialogData.searchType = 'name';
            next({ response: contactPerson});
        }else{
            session.sendTyping();
            setTimeout(function () {
                session.dialogData.searchType = 'competence';
                builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "selection") , session.localizer.gettext(session.preferredLocale(), "departments"), {listStyle: builder.ListStyle.button}, {maxRetries: 2});    
            }, timeout); 
 }
    },

    function(session, results){
        var entity = results.response.entity; 
        var searchType = session.dialogData.searchType;

        if (entity && searchType){

            botStorage.getAnswerByIntentAndEntityName("getContactPerson", searchType, entity, function (err, dbResults) {
                if (err) {
                    console.log(err);
                    throw (err);
                }else{
                    if(dbResults.length === 0){
                        session.send(session.localizer.gettext(session.preferredLocale(), "getContactPersonNoResult"));

                    }else{
                        if(session.dialogData.searchType === 'competence'){
                            session.sendTyping();
                            setTimeout(function () {
                                session.send(session.localizer.gettext(session.preferredLocale(), "getContactPerson") , botUtils.toProperCase(entity));
                            }, timeout); 
                        } 

                        var contactCard = new builder.HeroCard(session);
                        contactCard.title(dbResults[0].name);
                        contactCard.subtitle(dbResults[0].text);
                        contactCard.text(session.localizer.gettext(session.preferredLocale(), "contact"), dbResults[0].phone, dbResults[0].email);
                        contactCard.images([
                           builder.CardImage.create(session, dbResults[0].image)
                        ]);

                        var message = new builder.Message(session).addAttachment(contactCard);

                        session.sendTyping();
                        setTimeout(function () {
                            session.send(message);
                            session.endDialog();    
                        }, timeout); 

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

