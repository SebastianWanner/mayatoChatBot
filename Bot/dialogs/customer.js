
var builder = require('botbuilder');

var lib = new builder.Library('customer');



//=========================================================
// Get Customer
//=========================================================

lib.dialog('getCustomer', [

    function(session, args){
        session.send('Mayato betreut Kunden aus vielen Branchen wie der Automotive-, Bank- oder Industrie-Branche');
        session.send('Hier eine Auswahl von Kunden, welche mit Mayato zusammengearbeitet haben.');

        builder.Prompts.confirm(session, "Wollen Sie sich auch Case Studies ansehen?");

    },

    function (session, results){
        if(results.response){
            session.beginDialog('CaseStudies')
        }
    }
]).triggerAction({
    matches:'getCustomer'
});

//=========================================================
// Get Case Studies
//=========================================================

lib.dialog('CaseStudies', function(session, args){

    session.send('Hier eine Auswahl von erfolgreich umgesetzten Projekten')

    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments([
            new builder.HeroCard(session)
                .title ("Volkswagen Financial Services AG")
                .text("Erfolgreiche Verbriefung von Autokreditverträgen mittels Business Intelligence")
                .buttons([
                    builder.CardAction.openUrl(session, "https://www.mayato.com/wp-content/uploads/2015/03/successstory_vwfs_abs_es_rev_vwfs.pdf", "Bitte hier klicken")
                ]),
            new builder.HeroCard(session)
                .title ("Mercedes-Benz Bank AG")
                .text("Betrugserkennung mit Self-Acting Data Mining")
                .buttons([
                    builder.CardAction.openUrl(session, "https://www.mayato.com/wp-content/uploads/2015/03/mayato_CaseStudy_MBB.pdf", "Bitte hier klicken")
                ]),

            new builder.HeroCard(session)
                .title ("Erfolgsmessung im Kampagnenmanagement")
                .text("Dreidimensionales Reporting durch effizientes Datenmanagement")
                .buttons([
                    builder.CardAction.openUrl(session, "https://www.mayato.com/wp-content/uploads/2015/03/CaseStudy_Kampagnenerfolgsmessung_Handel1.pdf", "Bitte hier klicken")
                ]),

            new builder.HeroCard(session)
                .title ("Predictive Policing")
                .text("Effizienter Einsatz von Polizeikräften bei Fußballspielen")
                .buttons([
                    builder.CardAction.openUrl(session, "https://www.mayato.com/wp-content/uploads/2015/03/PredictivePolicing_Success_Story_abgenommen.pdf", "Bitte hier klicken")
                ])
      
        ]);

    session.send(message);

}).triggerAction({
    matches:'getCaseStudies'
});

//=========================================================
// Get Contact Person
//=========================================================

lib.dialog('getContactPerson', [
    function(session, args, next){
        var departmentEntity = builder.EntityRecognizer.findEntity(args.intent.entities, "department");

        
        if (departmentEntity){
        
            next({response: departmentEntity});
        }else{
            builder.Prompts.choice(session, "Wählen Sie einen Bereich aus.", departments, {listStyle: builder.ListStyle.button}, {maxRetries: 2});
        }
    },
    function(session, results, next){
        if (!results.response){
            session.send("Die Angabe war falsch");
            return;
        }

        
        var department = builder.EntityRecognizer.findBestMatch(departments, results.response.entity);

        switch(department.entity){
            case "customer analytics":
                session.send("Ihr Ansprechpartner im Bereich Customer Analytics ist:")

                var contactCard = new builder.HeroCard(session);
                contactCard.title("Peter Neckel");
                contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: peter.neckel@mayato.com");
                var message = new builder.Message(session).addAttachment(contactCard);
                session.send(message);
                break;
            case "financial analytics":
                session.send("Ihr Ansprechpartner im Bereich Financial Analytics ist:")

                var contactCard = new builder.HeroCard(session);
                contactCard.title("Georg Heeren");
                contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: georg.heeren@mayato.com");
                var message = new builder.Message(session).addAttachment(contactCard);
                session.send(message);
                break;
            case "industry analytics":
                session.send("Ihr Ansprechpartner im Bereich Industry Analytics ist:")

                var contactCard = new builder.HeroCard(session);
                contactCard.title("Eric Ecker");
                contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: eric.ecker@mayato.com");
                var message = new builder.Message(session).addAttachment(contactCard);
                session.send(message);
                break;
            case "it operations analytics":
                session.send("Ihr Ansprechpartner im Bereich IT Operations Aanalytics ist:")

                var contactCard = new builder.HeroCard(session);
                contactCard.title("Eric Ecker");
                contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: eric.ecker@mayato.com");
                var message = new builder.Message(session).addAttachment(contactCard);
                session.send(message);
                break;
            case "data science":
                session.send("Ihr Ansprechpartner im Bereich Data Science ist:")

                var contactCard = new builder.HeroCard(session);
                contactCard.title("Dr. Marcus Dill");
                contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: marcus.dill@mayato.com");
                var message = new builder.Message(session).addAttachment(contactCard);
                session.send(message);
                break;
            case "technology":
                builder.Prompts.choice(session, "Für welche Themen interessieren Sie sich?", "Strategie und Methodik|DWH und Big Data|Reporting, Planung und Analytics|Datenanalysen mit SAP|Datenanalysen mit SAS", {listStyle: builder.ListStyle.button});
                break;
            case "training":
                session.send("Ihr Ansprechpartner im Bereich IT Operations Aanalytics ist:")

                var contactCard = new builder.HeroCard(session);
                contactCard.title("mayato Training");
                contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: training@mayato.com");
                var message = new builder.Message(session).addAttachment(contactCard);
                session.send(message);
                break;
            default:
                session.send("Sorry, ich habe keinen Ansprechpartner gefunden")
            }



    },

     function(session, results){
         if (results.response){
             switch(results.response){
                 case "Strategie und Methodik", "Reporting, Planung und Analytics", "Datenanalysen mit SAS": 
                    session.send("Ihr Ansprechpartner im Bereich IT Operations Aanalytics ist:")

                    var contactCard = new builder.HeroCard(session);
                    contactCard.title("Georg Heeren");
                    contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: georg.heeren@mayato.com");
                    break;
                case "DWH und Big Data", "Datenanalysen mit SAP":
                    session.send("Ihr Ansprechpartner im Bereich IT Operations Aanalytics ist:")

                    var contactCard = new builder.HeroCard(session);
                    contactCard.title("Dr. Marcus Dill");
                    contactCard.text("Tel-Nr.: +49/30 4174 4270 10\nE-Mail: marcus.dill@mayato.com");
                    break;
                default:

             }
         }
        }
]).triggerAction({
    matches:'getContactPerson'
});

module.exports.createLibrary = function(){
    return lib.clone();
}