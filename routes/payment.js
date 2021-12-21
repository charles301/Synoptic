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


// topup function to add balance 
router.post('/', function(req, res, next) {

    const userID = req.cookies.userID
    const currentCredit = parseInt(req.cookies.credit)
    console.log("here") 
    console.log(req.body)
    console.log(currentCredit)
    const ammountToSubtract = parseInt(req.body.ammount)
    console.log(ammountToSubtract)
    console.log(currentCredit)
    console.log(userID)
    var params = {
        TableName: "usersTable",
        Key:{
        "id": `${userID}`
        },
        UpdateExpression: "set balance = :balance",
        ExpressionAttributeValues: {
        ":balance": currentCredit - ammountToSubtract
    },
  };

  docClient.update(params, onUpdate); function onUpdate(err, data) {
    if (err) {
      console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
    } else if(data.Count === 0){
      res.status(404)
      res.send("User not registered, please send post request with following attributes: id, name, email, mobileNumber")
    } else {
      res.status(200)
        res.redirect(`/users/${userID}`)
      console.log(data)
      console.log("Scan succeeded.");
    }
  }
});

module.exports = router;




