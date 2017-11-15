

var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");
var config = require('../../config');

var lib = new builder.Library('services');


//var BotStorage = require("../../models/botStorage");
//var DocDbClient = require("../../models/docDbClient");
//var DocumentDBClient = require('documentdb').DocumentClient;

/* var azureClient = new DocumentDBClient(config.host, {
    masterKey: config.masterKey
});
docDbClient.init(); 
var docDbClient = new DocDbClient(azureClient, config.databaseId, config.collectionId);
var botStorage = new BotStorage(docDbClient);*/

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var chatbotStrings = require('../../mayatoChatbot-strings.js');

var departments = ["Customer Analytics", "Financial Analytics", "Industry Analytics", "IT Operations Analytics", "Technology"];


lib.dialog('getServiceInformation', [
    function(session, args, next){
        var competence = builder.EntityRecognizer.findEntity(args.intent.entities, 'competence');
        
        if(competence){
            next({ response: competence});
        }else{
            session.send(chatbotStrings.serviceInformation)
            builder.Prompts.choice(session, chatbotStrings.serviceSelection, departments, {listStyle: builder.ListStyle.button}, {maxRetries: 2}); 
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
                     session.send(chatbotStrings.dbResultZero);

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
                        session.send(chatbotStrings.error)
    
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
    
                session.send('mayato arbeitet mit verschiedenen Technologien und Software Systemen');

                session.send('Hier eine kleine Auswahl:');
    
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
                    session.send("Leider wurden keine Treffer gefunden")

                }else{
                    session.send('mayato hat mit ' + botUtils.toProperCase(system) + 'eine Partnerschaft')
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




         /*        if (typeof results.response.type !== "undefined"){
            selection = results.response.type;
        } else{
            selection = results.response.entity;
            results.response.type = results.response.entity;
    
        }*/


/*        selection = results.response.entity;

           switch(selection){
                case "Customer Analytics":
                    session.send("Wir unterstützen Sie im Bereich Media Analytics, Customer Analytics, Customer Prediction oder Social Medial Analytics");
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                    break;
                 case "Data Science":
                    session.send("mayato bietet Ihnen brandaktuelles Wissen und optimale Lösungen zur weiterführenden und zukunftsgerichteten Analyse Ihrer Datenbestände")
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                    break;
                case "Industry Analytics":
                    session.send("Mayato hilft Ihnen, Sensordaten, Wartungsberichten, Productions- und Reperaturhistorien zu analysieren und auszuwerten. Mayato besitzt langjährige Erfahrung im Aufbau von Big-Data-Architekturen un in der Analyse großer komplexer Datenmengen")
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                    break;
                case "IT Operations Analytics":
                    session.send("Operational Analytics lernt aus dem Verhalten und Ereignissen in Ihrer IT-Infrastruktur und kann so den Ausfall einzelner Komponenten ihrer IT-Infrastruktur vorhersagen.")
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                    break;
                case "Financial Analytics":
                    session.send("Wie lässt sich die Unternehmensentwicklung zielsicher planen? Ist beispielsweise eine Investition sinnvoll? In welchem Umfang können Kosten gespart werden. Unsere Lösungen für Performance Analytics sind eine einzigartige Kombination bewährter Analyse- und Planungswerkzeuge")
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                    break;
                case "Technology":
                    session.send("mayato hilft Ihnen und Ihrer IT, eine Gesamtstrategie und die richtige Organisation für Business Intelligence und Analytics zu entwerfen. ")
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                    break;
                default:
                    session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(results.response.entity));
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
            }*/
            