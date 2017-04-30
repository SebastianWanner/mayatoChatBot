

var builder = require('botbuilder');

var lib = new builder.Library('services');


lib.dialog('getServiceInformation', [
    function(session, args){
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
            session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", customerAnalyticsEntity.entity);
            session.replaceDialog("customer:getContactPerson", {serviceInformation: customerAnalyticsEntity} );
            //next({ response: customerAnalyticsEntity});

        }else if (dataScienceEntity) {
            session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", dataScienceEntity.entity);
            session.replaceDialog("customer:getContactPerson", {serviceInformation: dataScienceEntity} );
            //next({ response: customerAnalyticsEntity});

        }else if (financialAnalyticsEntity) {
            session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", financialAnalyticsEntity.entity);
            session.replaceDialog("customer:getContactPerson", {serviceInformation: financialAnalyticsEntity} );
            //next({ response: customerAnalyticsEntity});

        }else if (industryAnalyticsEntity) {
            session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", industryAnalyticsEntity.entity);
            session.replaceDialog("customer:getContactPerson", {serviceInformation: industryAnalyticsEntity} );
            //next({ response: customerAnalyticsEntity});

        }else if (itOperationsAnalyticsEntity) {
            session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", itOperationsAnalyticsEntity.entity);
            session.replaceDialog("customer:getContactPerson", {serviceInformation: itOperationsAnalyticsEntity} );
            //next({ response: customerAnalyticsEntity});

        }else if (technologyEntity) {
            session.send("Die Mayato GmbH bietet Ihnen Beratungsleistungen im Bereich %s an.", technologyEntity.entity);
            session.replaceDialog("customer:getContactPerson", {serviceInformation: technologyEntity} );
            //next({ response: customerAnalyticsEntity});
        }else{
            session.send('GGemeinsam mit seinen Kunden entwirft und realisiert mayato Lösungen in den Bereichen Financial Analytics, Customer Analytics, Industry Analytics und Security Analytics.')
            builder.Prompts.choice(session, "Wähle einen Bereich aus, um mehr Informationen zu erhalten", "Customer Analytics|Industry Analytics|IT Operations Analytics|Financial Analytics|Data Science|Technology", {listStyle: builder.ListStyle.button}); 
        }
    },

    function (session, results, next) {
        if (results.response) {
            var selection = results.response.entity;

           switch(selection){
                case "Customer Analytics":
                    session.send("Wir uunterstützen Sie im Bereich Media Analytics, Customer Analytics, Customer Prediction oder Social Medial Analytics");
                    break;
                 case "Data Science":
                    session.send("")
                    break;
                case "Industry Analytics":
                    session.send("")
                    break;
                case "IT Operations Analytics":
                    session.send("")
                    break;
                case "Financial Analytics":
                    session.send("")
                    break;
                case "Technology":
                    session.send("")
                    break;
                
                //default:
                    //session.send("Leider kann ich Ihnen nicht weiterhelfen. Da muss ich mal mit meinem Entwickler reden.")
            }
            
        } 
    }
]).triggerAction({
    matches:'getServiceInformation'
});

module.exports.createLibrary = function(){
    return lib.clone();
}