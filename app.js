var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();

//departments of mayato
var departments = ["customer analytics", "financial analytics", "industry analytics", "it operations analytics", "data science", "technology", "training"];

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());


// Serve a static web page
server.get(/.*/, restify.serveStatic({
        'directory': '.',
        'default': 'index.html'
}));

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});



var bot = new builder.UniversalBot(connector, function (session) { 
     session.send("Sorry, Ich konnte die Eingabe leider nicht verstehen. Bitte schreiben Sie \'Hilfe\' für mehr Informationen"); 
 }); 
 
// Add global LUIS recognizer to bot 
var model = process.env.model || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/19fd82bb-c6a8-4ed7-ba2b-eabe2ff3edf5?subscription-key=6db68835a1ec41518c5ac8b77c8aea58&staging=true&verbose=true&timezoneOffset=0.0&q='; 
bot.recognizer(new builder.LuisRecognizer(model)); 

//Sends greeting message when the bot is first added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text("Hallo, ich bin der Mayato ChatBot! Wie kann ich Ihnen behilflich sein?");
                bot.send(reply);
            }
        });
    }
});



bot.dialog('greeting', function(session, args){

   var msg = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    session.send(msg);

    session.send('Schönen Guten Tag! Was beschäftigt Sie?')
}).triggerAction({
    matches:'greeting'
});

//=========================================================
// Feeling
//=========================================================

bot.dialog('feeling', [
    function(session, args){
        var feeling = ['Mir geht`s super und selber?', 'ein bisschen müde und selber?', 'danke gut und selber?'];
        
        builder.Prompts.text(session, feeling[Math.floor(Math.random()*(3-0)+0)]);
    },

    function(session, results){
        session.send('Wie kann ich helfen?')
    }

]).triggerAction({
    matches:'feeling'
});

//=========================================================
// Get Contact Person
//=========================================================

bot.dialog('getContactPerson', [
    function(session, args, next){
        var departmentEntity = builder.EntityRecognizer.findEntity(args.intent.entities, "department");

        
        if (departmentEntity){
        
            next({response: departmentEntity});
        }else{
            builder.Prompts.choice(session, "Wählen Sie einen Bereich aus.", departments, {listStyle: builder.ListStyle.button});
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

//=========================================================
// Get Management Information
//=========================================================

bot.dialog('getManagementInformation', function(session, args){
    session.send('Die geschäftsführende Gesellschafter der Mayato GmbH sind')

    var message = new builder.Message(session)
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

}).triggerAction({
    matches:'getManagementInformation'
});

//=========================================================
// Get FoundationDate
//=========================================================

bot.dialog('getFoundationDate', function(session, args){
    session.send('Die Mayato GmbH wurde im Jahre 2007 gegründet.')


}).triggerAction({
    matches:'getFoundationDate'
});

//=========================================================
// Get Service Information
//=========================================================

bot.dialog('getServiceInformation', [
    function(session, args){
        var departmentEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'department');

        if(departmentEntity){
            //next({ response: cityEntity.entity });

        }else {
        
            session.send('Gemeinsam mit seinen Kunden entwirft und realisiert mayato Lösungen in den Bereichen Financial Analytics, Customer Analytics, Industry Analytics und Security Analytics.')
            builder.Prompts.choice(session, "Wähle einen Bereich aus, um mehr Informationen zu erhalten", "Customer Analytics|Industry Analytics|IT Operations Analytics|Financial Analytics", {listStyle: builder.ListStyle.button}); 
        }
    },

    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;

           switch(selection){
                case "Customer Analytics":
                    session.send("Wir unterstützen Sie im Bereich Media Analytics, Customer Analytics, Customer Prediction oder Social Medial Analytics")
            }
            
        } 
    }
]).triggerAction({
    matches:'getServiceInformation'
});

//=========================================================
// Get Customer
//=========================================================

bot.dialog('getCustomer', function(session, args){
    session.send('Mayato betreut Kunden aus vielen Branchen wie der Automotive-, Bankb- oder Industrie-Branche');
    session.send('Hier eine Auswahl von erfolgreich umgesetzten Projekten');


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
    matches:'getCustomer'
});

//=========================================================
// Goodbye
//=========================================================

bot.dialog('goodbye', function(session, args){
    session.send('Auf Wiederseheen. Ich wünsche Ihnen einen schönen Tag')


}).triggerAction({
    matches:'goodbye'
});