

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

var JSONStorage = require("../../models/JSONStorage");
var botStorage = new JSONStorage();

var departments = ["Customer Analytics", "Financial Analytics", "Industry Analytics", "IT Operations Analytics", "Technology"];


lib.dialog('getServiceInformation', [
    function(session, args, next){
        var customerAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Customer Analytics');
        var dataScienceEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Data Science');
        var financialAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Financial Analytics');
        var industryAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Industry Analytics');
        var itOperationsAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'IT Operations Analytics');
        var technologyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Technology');

       
       if(customerAnalyticsEntity){
            next({ response: customerAnalyticsEntity});

        }else if (dataScienceEntity) {
            next({ response: dataScienceEntity});

        }else if (financialAnalyticsEntity) {
            next({ response: financialAnalyticsEntity});

        }else if (industryAnalyticsEntity) {
            next({ response: industryAnalyticsEntity});

        }else if (itOperationsAnalyticsEntity) {
            next({ response: itOperationsAnalyticsEntity});

        }else if (technologyEntity) {
            next({ response: technologyEntity});
        }else{
            session.send('Gemeinsam mit seinen Kunden entwirft und realisiert mayato Lösungen in den Bereichen Financial Analytics, Customer Analytics, Industry Analytics und Security Analytics.')
            builder.Prompts.choice(session, "Wähle einen Bereich aus, um mehr Informationen zu erhalten", "Customer Analytics|Industry Analytics|IT Operations Analytics|Financial Analytics|Technology", {listStyle: builder.ListStyle.button}, {maxRetries: 2}); 
        }

        
    },

    function (session, results, next) {
        if(!results.response){
            return;
        }

        console.log(results.response);

        session.sendTyping;

        botStorage.getAnswerByIntentAndEntity("getServiceInformation", results.response.entity, function (err, dbResults) {
             if (err) {
                 console.log(err);
                 throw (err);
             }else{
                 if(dbResults.length === 0){
                     console.log(dbResults.length);
                     next({response: results.response})

                 }else{
                    console.log(dbResults);
                    session.send(dbResults[0].text);
                    session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );
                 }
             }
         });
    },


     function (session, results) {
        if(!results.response){
            return;
        }

        session.sendTyping;

        session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(results.response.entity));
        session.replaceDialog("customer:getContactPerson", {serviceInformation: results.response} );


 
    }
]).triggerAction({
    matches:'getServiceInformation'
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
            