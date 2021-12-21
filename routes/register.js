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

router.post('/', function (req, res, next) {
    console.log(req.body.id)
    console.log("Adding User into DynamoDB. Please wait.");
        const params = {
            TableName: "usersTable",
            Item: {
                "id": req.body.id,
                "name": req.body.name,
                "email": req.body.email,
                "mobileNumber": req.body.mobileNumber,
                "balance": 0,
                "pin": req.body.pin
            }
        };
        docClient.put(params, function (err, data) {
            if (err) {
                res.status(400)
                console.error("Unable to add User", req.body.name, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:", req.body.name);
                res.status(200)
                res.send("Success adding user to database")
            }
        });
});

module.exports = router;




