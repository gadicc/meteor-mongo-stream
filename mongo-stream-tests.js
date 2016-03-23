// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by mongodb-stream.js.
import { name as packageName } from "meteor/mongodb-stream";

// Write your tests here!
// Here is an example.
Tinytest.add('mongodb-stream - example', function (test) {
  test.equal(packageName, "mongodb-stream");
});
