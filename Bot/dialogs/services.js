

var builder = require('botbuilder');

var lib = new builder.Library('services');

//=========================================================
// Get Service Information
//=========================================================

lib.dialog('getServiceInformation', [
    function(session, args){
        var departmentEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'department');

        if(departmentEntity){
            next({ response: cityEntity.entity });

        }else {
        
            session.send('Gemeinsam mit seinen Kunden entwirft und realisiert mayato Lösungen in den Bereichen Financial Analytics, Customer Analytics, Industry Analytics und Security Analytics.')
            builder.Prompts.choice(session, "Wähle einen Bereich aus, um mehr Informationen zu erhalten", "Customer Analytics|Industry Analytics|IT Operations Analytics|Financial Analytics", {listStyle: builder.ListStyle.button}); 
        }
    },

    function (session, results, next) {
        if (results.response) {
            var selection = results.response.entity;

           switch(selection){
                case "Customer Analytics":
                    session.send("Wir unterstützen Sie im Bereich Media Analytics, Customer Analytics, Customer Prediction oder Social Medial Analytics")
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