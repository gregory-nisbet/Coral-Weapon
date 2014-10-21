var mongodb = require("mongodb");

var server = new mongodb.Server("127.0.0.1", 27017, {});
// 27017 is the default port for connecting to MongoDB
var client = new mongodb.Db('test', server);

var collect;

// Open the client's connection to the server:
client.open(function(err, p_client) {
  console.log("Connected to MongoDB!");

  // Create a collection, if it doesn't exist already:
  client.createCollection("running-routes", function(err, collection) {
    console.log("Created collection");

    var document = {foo : 'bar'};

    // Insert it to the collection:

    collection.insert(document);
    collect = collection;
  });
});
