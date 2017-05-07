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

    getAnswerByEntity: function ( entity, callback) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.entity=@entity',
             parameters: [{
                 name: '@entity',
                 value: entity
             }]
         };

         self.docDbClient.find(querySpec, function (err, items) {
             if (err) {
                 throw (err);
             }
             // bla bla bla
             //return the results
             callback(items)

         });
     },

    getAnswerByTag: function (tag, callback) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE ARRAY_CONTAINS(r.tag, @tag)',
             parameters: [{
                 name: '@tag',
                 value: "Customer Analytics"
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