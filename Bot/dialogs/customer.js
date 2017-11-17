
var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");

var lib = new builder.Library('customer');
var config = require('../../config');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();


//=========================================================
// Get Customer
//=========================================================

lib.dialog('getCustomer', [

    function(session, args){

        session.sendTyping;

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

            session.send(session.localizer.gettext(session.preferredLocale(), "getCustomer"));

            var message = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);

            session.send(message);
        }

        session.send(session.localizer.gettext(session.preferredLocale(), "tipCaseStudies"));
        session.endDialog();

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
            builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "questionCaseStudies"), session.localizer.gettext(session.preferredLocale(), "departments"), { listStyle: builder.ListStyle.button } ); 
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
                                .title(item.title)
                                .subtitle(item.company)
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

                session.send(session.localizer.gettext(session.preferredLocale(), "caseStudiesSelection"), botUtils.toProperCase(competence))

                var message = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);

                session.send(message);
                session.endDialog();
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
                builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "selection") , session.localizer.gettext(session.preferredLocale(), "departments"), {listStyle: builder.ListStyle.button}, {maxRetries: 2});
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
                        session.send(session.localizer.gettext(session.preferredLocale(), "getContactPersonNoResult"));

                    }else{
                        session.send(session.localizer.gettext(session.preferredLocale(), "getContactPerson") , botUtils.toProperCase(competence));

                        var contactCard = new builder.HeroCard(session);
                        contactCard.title(dbResults[0].name);
                        contactCard.text(session.localizer.gettext(session.preferredLocale(), "contact"), dbResults[0].phone, dbResults[0].email);
                        contactCard.images([
                           builder.CardImage.create(session, dbResult[0].image)
                        ]);

                        var message = new builder.Message(session).addAttachment(contactCard);
                        session.send(message);
                        session.endDialog();
                        
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

