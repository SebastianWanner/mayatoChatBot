
var builder = require('botbuilder');

var lib = new builder.Library('basicDialogs');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var counter = 0;

//=========================================================
// None
//=========================================================

lib.dialog('None', 
function(session, args){ 
    if (counter == 2){   
        session.send("Leider hab ich Sie nicht verstanden. Ich glaube, ich muss mal mit meinem Entwickler reden");
        session.send("Schreiben Sie \"Tipp\" wenn sie nicht mehr weiter wissen.");
        session.replaceDialog("Tip");
        counter = 0;
    }
}
).triggerAction({
    matches:'None'
});

//=========================================================
// Get a Tip
//=========================================================

lib.dialog('Tip', 
function(session, args){ 

    botStorage.getAnswerByIntent("getTip", function (err, dbResults) {
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
            
            }
        }
    });
}
).triggerAction({
    matches:'Tip'
});



//=========================================================
// GetHelp
//=========================================================

lib.dialog('getHelp', 
function(session, args){    
    session.send("Kommst du nicht weiter? Suche noch mal nach Case Studies");
    session.replaceDialog("Tip");

}
).triggerAction({
matches:'getHelp'
});


//=========================================================
// Greeting
//=========================================================

lib.dialog('greeting', function(session, args){

    //session.send('Schönen Guten Tag! Was beschäftigt Sie?');
    console.log(session.localizer.gettext(session.preferredLocale(), "greeting"));
    console.log(session.localizer);
    session.sendTyping();
    session.send("greeting");
    session.endDialog();
    
}).triggerAction({
    matches:'greeting'
});

//=========================================================
// Feeling
//=========================================================

lib.dialog('feeling', [
    function(session, args){
        var feeling = ['Mir geht`s super und selber?', 'ein bisschen müde und selber?', 'danke gut und selber?'];
        
        session.sendTyping();
        builder.Prompts.text(session, feeling[Math.floor(Math.random()*(3-0)+0)]);
    },

    function(session, results){
        session.send('Was kann ich für Sie tun?')
        session.endDialog();
    }

]).triggerAction({
    matches:'feeling'
});

//=========================================================
// Humanor Machine
//=========================================================

lib.dialog('HumanOrMachine', 
    function(session, args){    
        session.send("Mensch oder Computer? Das ist eine gute Frage. Finde es selber heraus!")
        session.endDialog();

    }
).triggerAction({
    matches:'HumanOrMachine'
});

//=========================================================
// Bot-Question
//=========================================================

lib.dialog('name', 
    function(session, args){    
        session.send("Ich bin Mike der Mayato ChatBot. Ich helfe dir alles über Mayato rauszufinden")
        session.endDialog();

    }
).triggerAction({
    matches:'name'
});

//=========================================================
// Age
//=========================================================

lib.dialog('age', 
    function(session, args){    
        var today = new Date();
        var birthday = new Date(2017, 3, 20);

        var timeDiff = Math.abs(today.getTime() - birthday.getTime());

    
        session.send("Ehrlich gesagt bin ich genau %s Tage alt.", Math.ceil(timeDiff/(1000*60*60*24)));
        session.endDialog();

    }
).triggerAction({
    matches:'age'
});


//=========================================================
// Goodbye
//=========================================================

lib.dialog('goodbye', function(session, args){
    session.endDialog('Auf Wiedersehen. Ich wünsche Ihnen einen schönen Tag')


}).triggerAction({
    matches:'goodbye'
});


module.exports.createLibrary = function(){
    return lib.clone();
}