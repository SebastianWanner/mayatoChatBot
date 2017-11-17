var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");
var config = require('../../config');

var lib = new builder.Library('services');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();


lib.dialog('getServiceInformation', [
    function(session, args, next){
        var competence = builder.EntityRecognizer.findEntity(args.intent.entities, 'competence');
        
        if(competence){
            next({ response: competence});
        }else{
            session.send(session.localizer.gettext(session.preferredLocale(), "serviceInformation"));
            builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "serviceSelection"), session.localizer.gettext(session.preferredLocale(), "departments"),, {listStyle: builder.ListStyle.button}, {maxRetries: 2}); 
        }   
    },

    function (session, results, next) {
        if(!results.response){
            return;
        }

        competence = results.response.entity;
        competence = botUtils.toProperCase(competence)

        session.sendTyping();

        botStorage.getAnswerByIntentAndEntity("getServiceInformation", competence, function (err, dbResults) {
             if (err) {
                 console.log(err);
                 throw (err);
             }else{
                 if(dbResults.length === 0){
                     console.log(dbResults.length);
                     session.send(session.localizer.gettext(session.preferredLocale(), "db_error"));

                 }else{
                    console.log(dbResults);
                    session.send(dbResults[0].text);
                    session.endDialog();
                    //session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                 }
             }
         });
    }

]).triggerAction({
    matches:'getServiceInformation'
});

//=========================================================
// Get software systems used at mayato
//=========================================================

lib.dialog('getSoftwareSystems', [

    function(session, args, next){
        var system = builder.EntityRecognizer.findEntity(args.intent.entities, 'softwareSystem');
        
        if(system){
            next({ response: system});
        }else{
            session.sendTyping();
    
            var cards = [];
            
            botStorage.getAnswerByIntent("getSoftwareSystems",  function (err, dbResults) {
                if (err) {
                    console.log(err);
                    throw (err);
                }else{
                    if(dbResults.length === 0){
                        session.send(session.localizer.gettext(session.preferredLocale(), "db_error"));
    
                    }else{
    
                        for(var item of dbResults){
                            var card =  new builder.HeroCard(session)
                                .title(item.name)
                                //.subtitle(item.text)
                                //.text(item.date)
                                .images([
                                    builder.CardImage.create(session, item.image)
                                ])

    
                            cards.push(card)
                        }
                    }
                }
            });
            
            if(cards){
    
                session.send(session.localizer.gettext(session.preferredLocale(), "getSoftwareSystem"));

                var message = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
    
                session.send(message);
                session.endDialog();
            }
              
        }   
    },

    function (session, results, next) {
        if(!results.response){
            session.endDialog;
        }

        var system = results.response.entity;
        system = botUtils.toProperCase(system)
            
        session.sendTyping;

        var cards = [];
        
        botStorage.getAnswerByIntentAndEntityName("getSoftwareSystems", "name", system,  function (err, dbResults) {
            if (err) {
                console.log(err);
                throw (err);
            }else{
                if(dbResults.length === 0){
                    session.send(session.localizer.gettext(session.preferredLocale(), "db_error"));

                }else{
                    session.send('mayato hat mit %s eine Partnerschaft', botUtils.toProperCase(system) )
                    //session.send('mayato hat mit ' + botUtils.toProperCase(system) + 'eine Partnerschaft')
                    session.endDialog();
                }
            }
        });
    }
    
    ]).triggerAction({
        matches:'getSoftwareSystems'
    });

module.exports.createLibrary = function(){
    return lib.clone();
}





