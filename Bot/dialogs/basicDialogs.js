
var builder = require('botbuilder');

var lib = new builder.Library('basicDialogs');

var JSONStorage = require("../../models/JSONStorage.js");
var botStorage = new JSONStorage();

var counter = 0;

var timeout = 5000;

//=========================================================
// None
//=========================================================

lib.dialog('None', 
function(session, args){ 
    if (counter == 1){
        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "error"));
            session.send(session.localizer.gettext(session.preferredLocale(), "help"));
            session.replaceDialog("tip");
            counter = 0;
        }, timeout);   

    }

    counter += 1;
}
).triggerAction({
    matches:'None'
});

//=========================================================
// Get a Tip
//=========================================================

lib.dialog('tip', 
function(session, args){ 

    botStorage.getAnswerByIntent("getTip", function (err, dbResults) {
        if (err) {
            console.log(err);
            throw (err);
        }else{
            if(dbResults.length === 0){
                console.log(dbResults.length);
                session.send(session.localizer.gettext(session.preferredLocale(), "tipNoResult"));
                session.endDialog();

            }else{
               console.log(dbResults);
               //session.send(session.localizer.gettext(session.preferredLocale(), "help"));

               for(var item of dbResults){
                    var number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

                    session.sendTyping();
                    setTimeout(function () {
                        session.send(item.tags[number]);
                        session.endDialog();
                    }, timeout);   

            }
            }
        }
    });
}
).triggerAction({
    matches:'tip'
});



//=========================================================
// GetHelp
//=========================================================

lib.dialog('getHelp', 
function(session, args){   
    session.sendTyping();
    setTimeout(function () {
        session.send(session.localizer.gettext(session.preferredLocale(), "help"));
        session.replaceDialog("tip");
    }, timeout);    
}
).triggerAction({
matches:'getHelp'
});


//=========================================================
// Greeting
//=========================================================

lib.dialog('greeting', function(session, args){


    session.sendTyping();
    setTimeout(function () {
        session.send(session.localizer.gettext(session.preferredLocale(), "greetingBasicDialog"));
        session.endDialog();
    }, timeout);   

    
}).triggerAction({
    matches:'greeting'
});

//=========================================================
// Feeling
//=========================================================

lib.dialog('feeling', [
    function(session, args){       
        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "feeling_") + Math.floor(Math.random() * (3 - 1 + 1)) + 1);
            //session.send(session.localizer.gettext(session.preferredLocale(), "help_2"))
            session.endDialog();
        }, timeout);   

    }

]).triggerAction({
    matches:'feeling'
});

//=========================================================
// Humanor Machine
//=========================================================

lib.dialog('HumanOrMachine', 
    function(session, args){    
        session.send(session.localizer.gettext(session.preferredLocale(), "humanOrMachine"))
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
        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "greetingBasicDialog"));
            session.endDialog();
        }, timeout);   

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

        session.sendTyping();
        setTimeout(function () {
            session.send(session.localizer.gettext(session.preferredLocale(), "age"), Math.ceil(timeDiff/(1000*60*60*24)));
            session.endDialog();
        }, timeout);       


    }
).triggerAction({
    matches:'age'
});


//=========================================================
// Goodbye
//=========================================================

lib.dialog('goodbye', function(session, args){
    session.endDialog(session.localizer.gettext(session.preferredLocale(), "goodbye"))


}).triggerAction({
    matches:'goodbye'
});


module.exports.createLibrary = function(){
    return lib.clone();
}