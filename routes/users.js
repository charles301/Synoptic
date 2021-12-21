var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");

var express = require('express');
const { route } = require('.');
var router = express.Router();

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();


// get all users
router.get('/', function(req, res, next) {
  var params = {
    TableName: "usersTable",
    ProjectionExpression: "#id, #name, #email, #mobileNumber, #balance, #pin",
    ExpressionAttributeNames: {
      "#id": "id",
      "#name": "name",
      "#email": "email",
      "#mobileNumber": "mobileNumber",
      "#balance": "balance",
      "#pin":"pin"
    }
  };
  console.log("Scanning Users table.");

  docClient.scan(params, onScan); function onScan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data)

      console.log("Scan succeeded.");
      data.Items.forEach(function (user) {
        console.log(user.id, user.email, user.balance)
      }); 
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }
    }
  }
});
// get user by ID

  
  
module.exports = router;
  


