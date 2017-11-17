
var builder = require('botbuilder');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var chatbotStrings = require('../../mayatoChatbot-strings.js');

var lib = new builder.Library('company');

//=========================================================
// mayato
//=========================================================

lib.dialog('mayato', 
    function(session, args){

        session.send(session.localizer.gettext(session.preferredLocale(), "mayatoInfo"));

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

        session.send(session.localizer.gettext(session.preferredLocale(), "management"));

        var message = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);

        session.send(message);
        session.endDialog();
    }
      



/*     var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments([
            new builder.HeroCard(session)
                .title ("Dr. Marcus Dill")
                .text("Seit 2007 geschäftsführender Gesellschafter der mayato GmbH. Mehr als zwei Jahrzehnte Erfahrung als Softwareentwickler, Berater, Architekt und Projektleiter. Experte für BI, Analytics, Technologie und Big Data")
                .images([
                    builder.CardImage.create(session, "https://www.mayato.com/wp-content/uploads/2016/07/CEO-Dr.-Marcus-Dill_300dpi.jpg")
                    //builder.CardImage.create(session, "https://www.google.de/imgres?imgurl=https%3A%2F%2Fi.vimeocdn.com%2Fportrait%2F58832_300x300&imgrefurl=https%3A%2F%2Fvimeo.com%2Fuser2082250&docid=L7pp2GXzszKRoM&tbnid=XWXPqrX1RFJiaM%3A&vet=10ahUKEwiBmfvX9qvTAhWKDxoKHcVBBucQMwg5KAEwAQ..i&w=300&h=300&bih=1014&biw=1920&q=test&ved=0ahUKEwiBmfvX9qvTAhWKDxoKHcVBBucQMwg5KAEwAQ&iact=mrc&uact=8")
                
                ]),
            new builder.HeroCard(session)
                .title ("Georg Heeren")
                .text("Seit 2007 geschäftsführender Gesellschafter der mayato GmbH, Coach (SG) and Organisationsberater. Langjährige erfolgreiche Tätigkeit in einer Vielzahl von BI-Beratungsprojekten, Internationale Projektleitung als PMP in Europa, Asien, Nord- und Südamerika.")
                .images([
                    builder.CardImage.create(session, "http://www.mayato.com/wp-content/uploads/2015/05/Mayato_Portrait_GH.jpg")
                ]),
            new builder.HeroCard(session)
                .title ("Sven Hensen")
                .text("Seit 2007 geschäftsführender Gesellschafter der mayato GmbH. Über 20 Jahre Erfahrung in der Konzeption und Umsetzung von Strategien und Architekturen für BI & Analytics im internationel Umfeld")
                .images([
                    builder.CardImage.create(session, "http://www.mayato.com/wp-content/uploads/2015/05/Mayato_Portrait_SH.jpg")
                ])
        ]);

    session.send(message);
    session.endDialog(); */

}).triggerAction({
    matches:'getManagementInformation'
});

//=========================================================
// Get FoundationDate
//=========================================================

lib.dialog('getFoundationDate', function(session, args){
    session.send(session.localizer.gettext(session.preferredLocale(), "foundation"));
    session.endDialog();
}).triggerAction({
    matches:'getFoundationDate'
});

//=========================================================
// Get News and Publications
//=========================================================

lib.dialog('getNews', [

    function(session, args){
        
        session.sendTyping();

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

            session.send(session.localizer.gettext(session.preferredLocale(), "news"));

            var message = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);

            session.send(message);
            session.endDialog();
        }
    }

]).triggerAction({
    matches:'getNews'
});



module.exports.createLibrary = function(){
    return lib.clone();
}