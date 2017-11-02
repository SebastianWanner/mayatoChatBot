
 var async = require('async');

 var database = require('../data/database.json'); 

 var botUtils = require("../Bot/utils/botUtils");

 var JSONStorage = function () {};


 JSONStorage.prototype.getAnswerByIntent = function (intent, callback) {

        var self = this;

        var results = [];
        var hasDate = false;
          

        for(var item of database){
                if(item.intent == intent){    
                    results.push(item)  
                    
                    if(item.date){
                        hasDate = true;
                    }
                }

            }

        if(hasDate){
            results.sort(botUtils.sort_by_Date);
        }
        
        callback(null, results)
        
     }
 
JSONStorage.prototype.getAnswerByIntentAndEntity =  function (intent, entity, callback) {
         var self = this;

        var results = [];

        for(var item of database){
                if(item.intent == intent && item.entity == entity){    
                    results.push(item)    
                }

            }

        callback(null, results)
     }

JSONStorage.prototype.getAnswerByIntentAndEntityName =  function (intent, entityName, entityValue, callback) {
        var self = this;

       var results = [];

       for(var item of database){
               if(item.intent == intent && item.entityName == entityValue){    
                   results.push(item)    
               }

           }

       callback(null, results)
    }

JSONStorage.prototype.getAnswerByIntentAndTag =  function (intent, tag, callback) {
         var self = this;

        var results = [];

        for(var item of database){
            if(item.intent == intent){
                for(var itemTag of item.tag){
                    if(itemTag == botUtils.toProperCase(tag)){
                        results.push(item)
                    }
                }
            }
        }

        callback(null, results)

     }



 module.exports = JSONStorage;