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



router.get('/:id/:pin', function (req, res, next) {
    const userID = req.params.id
    const userPIN = req.params.pin
    console.log(userPIN)
    //res.redirect("/topUp")
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
    
  
    docClient.query(params, onQuery); function onQuery(err, data) {
      if (err) {
        console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
      } else if(data.Count === 0){
        res.status(404)
        res.send("User not registered, please send post request to '/register' with following attributes: id, name, email, mobileNumber")
      } else {
        console.log("test")
        console.log(data)
        if (userPIN == data.Items[0].pin){
        res.cookie("userID", userID,{ expires: new Date(Date.now() + 1120000), httpOnly: true })
        res.cookie("credit", data.Items[0].balance ,{ expires: new Date(Date.now() + 1120000), httpOnly: true })
        res.cookie("loggedIn", true)
        res.send(data)
  
        console.log(data)
        console.log("Scan succeeded.");
        data.Items.forEach(function (user) {
          console.log(user.id, user.email, user.balance)
        });
      }else {
        res.status(403)
        res.send("Incorrect PIN")
        }
        if (typeof data.LastEvaluatedKey != "undefined") {
          console.log("Scanning for more...");
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          docClient.scan(params, onScan);
        }
      }
    }
  }
  );
  
  
  
  module.exports = router;
  