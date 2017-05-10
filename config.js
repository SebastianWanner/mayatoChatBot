 var config = {}

 config.host = process.env.HOST;
 config.masterKey = process.env.AUTH_KEY;
 config.databaseId = "mayatoChatBot";
 config.collectionId = "Answers";

 module.exports = config;