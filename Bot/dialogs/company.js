
var builder = require('botbuilder');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var lib = new builder.Library('company');

var timeout = 5000;

//=========================================================
// mayato
//=========================================================

lib.dialog('mayato', 
    function(session, args){

        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "mayatoInfo"));            
        }, timeout);   

    }
).triggerAction({
    matches:'mayato'
});

//=========================================================
// Get Management Information
//=========================================================

lib.dialog('getManagementInformation', function(session, args){
    
    var cards = [];
    
    botStorage.getAnswerByIntentAndEntityName("getContactPerson", "job", "Managing Director",  function (err, dbResults) {
        if (err) {
            console.log(err);
            throw (err);
        }else{
            if(dbResults.length === 0){
                session.send(session.localizer.gettext(session.preferredLocale(), "getManagementError"));

            }else{

                for(var item of dbResults){
                    var card =  new builder.HeroCard(session)
                        .title(item.name)
                        .text(item.text)
                        .images([
                            builder.CardImage.create(session, item.image)
                        
                        ]);


                    cards.push(card)
                }
            }
        }
    });
    
    if(cards){

        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "management"));     
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
      
}).triggerAction({
    matches:'getManagementInformation'
});

//=========================================================
// Get FoundationDate
//=========================================================

lib.dialog('getFoundationDate', function(session, args){
    session.sendTyping();
    setTimeout(function () {
        session.send(session.localizer.gettext(session.preferredLocale(), "foundation"));
        session.endDialog();
    }, timeout);   

}).triggerAction({
    matches:'getFoundationDate'
});

//=========================================================
// Get News and Publications
//=========================================================

lib.dialog('getNews', [

    function(session, args){
        
        var cards = [];
        
        botStorage.getAnswerByIntent("getNews",  function (err, dbResults) {
            if (err) {
                console.log(err);
                throw (err);
            }else{
                if(dbResults.length === 0){
                    session.send(session.localizer.gettext(session.preferredLocale(), "noNews"));

                }else{

                    for(var item of dbResults){
                        var card =  new builder.HeroCard(session)
                            .title(item.title)
                            .subtitle(item.text)
                            .text(item.date)
                            .images([
                               builder.CardImage.create(session, item.image)
                            ])
                            .buttons([
                                builder.CardAction.openUrl(session, item.url, session.localizer.gettext(session.preferredLocale(), "click"))
                        ]);

                        cards.push(card)
                    }
                }
            }
        });

        if(cards){

            session.sendTyping();
            setTimeout(function () {
                session.send(session.localizer.gettext(session.preferredLocale(), "news"));
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

]).triggerAction({
    matches:'getNews'
});



module.exports.createLibrary = function(){
    return lib.clone();
}