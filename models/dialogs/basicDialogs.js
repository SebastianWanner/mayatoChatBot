
var builder = require('botbuilder');

var lib = new builder.Library('basicDialogs');

//=========================================================
// Greeting
//=========================================================

lib.dialog('greeting', function(session, args){

    session.send('Schönen Guten Tag! Was beschäftigt Sie?');
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