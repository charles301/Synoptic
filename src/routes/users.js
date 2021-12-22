const AWS = require("aws-sdk");
const express = require('express');

const router = express.Router();

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();


// get all users
router.get('/', function(req, res, next) {
  const params = {
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


  
  
module.exports = router;
  


