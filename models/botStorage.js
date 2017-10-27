// create controller
//https://docs.microsoft.com/en-us/azure/documentdb/documentdb-nodejs-application

 var DocumentDBClient = require('documentdb').DocumentClient;
 var async = require('async');

 function BotStorage(docDbClient) {
   this.docDbClient = docDbClient;
 }

  BotStorage.prototype = {
     getAnswerByIntent: function (intent, callback) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.intent=@intent',
             parameters: [{
                 name: '@intent',
                 value: intent
             }]
         };


         self.docDbClient.find(querySpec, function (err, items) {
             if (err) {
                 callback(err);
             }else{
                 
             // bla bla bla
             //return the results
             callback(null, items)

             }


         });
     },

    getAnswerByEntityAndIntend: function (intent, entity, callback) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.intent = @intent AND r.entity=@entity',
             parameters: [{
                 name: '@entity',
                 value: entity
             },{
                 name: '@intent',
                 value: intent
             }]
         };

         self.docDbClient.find(querySpec, function (err, items) {
             if (err) {
                 throw (err);
             }
             // bla bla bla
             //return the results
             callback(null, items);

         });
     },

    getAnswerByTag: function (intent, tag, callback) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.intent = @intent AND ARRAY_CONTAINS(r.tag, @tag)',
             parameters: [{
                 name: '@intent',
                 value: intent
             },{
                 name: '@tag',
                 value: tag
             }]
         };

         self.docDbClient.find(querySpec, function (err, items) {
             if (err) {
                 console.log(err);
                 throw (err);
             }
             
             // bla bla bla
             //return the resultss
             callback(null, items)

         });
     },

 };



 module.exports = BotStorage;