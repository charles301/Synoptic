var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");

var express = require('express');
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
    ProjectionExpression: "#id, #name, #email, #mobileNumber, #balance",
    ExpressionAttributeNames: {
      "#id": "id",
      "#name": "name",
      "#email": "email",
      "#mobileNumber": "mobileNumber",
      "#balance": "balance"
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
router.get('/:id', function (req, res, next) {
  const userID = req.params.id
  var params = {
    TableName: "usersTable",
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ':id': userID
    },
  };
  console.log("Scanning Users table.");

  docClient.query(params, onQuery); function onQuery(err, data) {
    if (err) {
      console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
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

module.exports = router;




