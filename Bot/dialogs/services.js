var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");


var lib = new builder.Library('services');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var timeout = 5000;


lib.dialog('getServiceInformation', [
    function(session, args, next){
        var competence = builder.EntityRecognizer.findEntity(args.intent.entities, 'competence');
        
        if(competence){
            next({ response: competence});
        }else{

            session.sendTyping();
            setTimeout(function () {
                session.send(session.localizer.gettext(session.preferredLocale(), "serviceInformation"));
            }, timeout);
            

            var contactCard = new builder.HeroCard(session);
            contactCard.images([
               builder.CardImage.create(session, session.localizer.gettext(session.preferredLocale(), "serviceInformation_image"))
            ]);

            var message = new builder.Message(session).addAttachment(contactCard);
            //Picture is not working
            //session.send(message);

            
            
            setTimeout(function () {
                session.send(session.localizer.gettext(session.preferredLocale(), "serviceInformation_1"));
            }, (timeout * 1.5));
            

           
            setTimeout(function () {
                session.send(session.localizer.gettext(session.preferredLocale(), "serviceInformation_2"));
            }, (timeout * 2));
            

            session.endDialog();

            //builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "serviceSelection"), session.localizer.gettext(session.preferredLocale(), "departments"), {listStyle: builder.ListStyle.button}); 
        }   
    },

    function (session, results, next) {
        if(!results.response){
            return;
        }

        competence = results.response.entity;
        competence = botUtils.toProperCase(competence)


        botStorage.getAnswerByIntentAndEntity("getServiceInformation", competence, function (err, dbResults) {
             if (err) {
                 console.log(err);
                 throw (err);
             }else{
                 if(dbResults.length === 0){
                     console.log(dbResults.length);
                     session.send(session.localizer.gettext(session.preferredLocale(), "db_error"));

                 }else{
                     if(dbResults[0].tags.length > 1){
                        var tags = dbResults[0].tags[0];

                        for(i=1; i<dbResults[0].tags.length; i++){
                            tags += "|" + dbResults[0].tags[i];
                        }

                        session.sendTyping();
                        setTimeout(function () {
                            session.send(dbResults[0].text);
                            builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "serviceSelection") , tags, {listStyle: builder.ListStyle.button}, {maxRetries: 2});
                        }, timeout);
                        
                        
                    }else{
                        session.sendTyping();
                        setTimeout(function () {
                            session.send(dbResults[0].text);
                            session.endDialog();
                        }, timeout);

                    }
                 }
             }
         });
    },

    function (session, results) {
        var entity = results.response.entity; 

        if(!entity){
            return;
        }


        botStorage.getAnswerByIntentAndEntity("getServiceInformation", entity, function (err, dbResults) {
             if (err) {
                 console.log(err);
                 throw (err);
             }else{
                 if(dbResults.length === 0){
                     session.send(session.localizer.gettext(session.preferredLocale(), "db_error"));

                 }else{
                    for(let i=0; i<dbResults[0].text.length; i++){
                        session.sendTyping();
                        setTimeout(function () {
                            session.send(dbResults[0].text[i]);       
                        }, (i+1) * timeout);
                               
                    }                    
                
                    session.endDialog();
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
    
                session.sendTyping();
                setTimeout(function () {
                    session.send(session.localizer.gettext(session.preferredLocale(), "getSoftwareSystem"));
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
    },

    function (session, results, next) {
        if(!results.response){
            session.endDialog;
        }

        var system = results.response.entity;
        system = botUtils.toProperCase(system)
            
        var cards = [];
        
        botStorage.getAnswerByIntentAndEntityName("getSoftwareSystems", "name", system,  function (err, dbResults) {
            if (err) {
                console.log(err);
                throw (err);
            }else{
                if(dbResults.length === 0){
                    session.send(session.localizer.gettext(session.preferredLocale(), "db_error"));

                }else{
                    session.sendTyping();
                    setTimeout(function () {
                        session.send(session.localizer.gettext(session.preferredLocale(), "getSoftwareSystem_name"), botUtils.toProperCase(system) )
                        //session.send('mayato hat mit ' + botUtils.toProperCase(system) + 'eine Partnerschaft')
                        session.endDialog();
                    }, timeout);

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





