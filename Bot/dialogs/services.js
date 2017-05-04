

var builder = require('botbuilder');
var botUtils = require("../utils/botUtils");

var lib = new builder.Library('services');


lib.dialog('getServiceInformation', [
    function(session, args, next){
        var customerAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'customer analytics');
        var dataScienceEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'data science');
        var financialAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'financial analytics');
        var industryAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'industry analytics');
        var itOperationsAnalyticsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'it operations analytics');
        var technologyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'technology');

        //if(args.entities[0]){
            //console.log(args.entities[0]["entity"]);
            //console.log(args.entities[0]["type"]);
        //}
        
    
        if(customerAnalyticsEntity){
            //session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(customerAnalyticsEntity.entity));
            //session.replaceDialog("customer:getContactPerson", {serviceInformation: customerAnalyticsEntity} );
            next({ response: customerAnalyticsEntity});

        }else if (dataScienceEntity) {
            //session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(dataScienceEntity.entity));
            //session.replaceDialog("customer:getContactPerson", {serviceInformation: dataScienceEntity} );
            next({ response: dataScienceEntity});

        }else if (financialAnalyticsEntity) {
            //session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(financialAnalyticsEntity.entity));
            //session.replaceDialog("customer:getContactPerson", {serviceInformation: financialAnalyticsEntity} );
            next({ response: financialAnalyticsEntity});

        }else if (industryAnalyticsEntity) {
            //session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(industryAnalyticsEntity.entity));
            //session.replaceDialog("customer:getContactPerson", {serviceInformation: industryAnalyticsEntity} );
            next({ response: industryAnalyticsEntity});

        }else if (itOperationsAnalyticsEntity) {
            //session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(itOperationsAnalyticsEntity.entity));
            //session.replaceDialog("customer:getContactPerson", {serviceInformation: itOperationsAnalyticsEntity} );
            next({ response: itOperationsAnalyticsEntity});

        }else if (technologyEntity) {
            //session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", botUtils.toProperCase(technologyEntity.entity));
            //session.replaceDialog("customer:getContactPerson", {serviceInformation: technologyEntity} );
            next({ response: technologyEntity});
        }else{
            session.send('Gemeinsam mit seinen Kunden entwirft und realisiert mayato Lösungen in den Bereichen Financial Analytics, Customer Analytics, Industry Analytics und Security Analytics.')
            builder.Prompts.choice(session, "Wähle einen Bereich aus, um mehr Informationen zu erhalten", "Customer Analytics|Industry Analytics|IT Operations Analytics|Financial Analytics|Technology", {listStyle: builder.ListStyle.button}, {maxRetries: 2}); 
        }
    },

    function (session, results, next) {
        var selection;

        if(!results.response.entity){
            return;
        }

        if (typeof results.response.type !== "undefined"){
            selection = results.response.type;
        } else{
            selection = results.response.entity;
            results.response.type = results.response.entity;
    
        }

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
            }
            
 
    }
]).triggerAction({
    matches:'getServiceInformation'
});

module.exports.createLibrary = function(){
    return lib.clone();
}