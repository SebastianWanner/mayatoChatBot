// create controller
//https://docs.microsoft.com/en-us/azure/documentdb/documentdb-nodejs-application

 var DocumentDBClient = require('documentdb').DocumentClient;
 var async = require('async');

 function botStorage(docDbClient) {
   this.docDbClient = docDbClient;
 }

  TaskList.prototype = {
     getAnswerByIntent: function (intent, res) {
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
                 throw (err);
             }

             //return the results

         });
     },

    getAnswerByEntity: function ( entity, res) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.completed=@completed',
             parameters: [{
                 name: '@completed',
                 value: false
             }]
         };

         self.docDbClient.find(querySpec, function (err, items) {
             if (err) {
                 throw (err);
             }

             //return the results

         });
     },

    getAnswerByTag: function (intent, entity, res) {
         var self = this;

         var querySpec = {
             query: 'SELECT * FROM root r WHERE r.completed=@completed',
             parameters: [{
                 name: '@completed',
                 value: false
             }]
         };

         self.docDbClient.find(querySpec, function (err, items) {
             if (err) {
                 throw (err);
             }

             //return the results

         });
     },

 };



 module.exports = botStorage;