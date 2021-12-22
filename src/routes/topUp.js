const AWS = require("aws-sdk");
const express = require('express');

const router = express.Router();

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

// topup function to add balance 
router.post('/', function(req, res, next) {

    const userID = req.cookies.userID
    const currentCredit = parseInt(req.cookies.credit)
    console.log("here") 
    console.log(req.body)
    console.log(currentCredit)
    const ammountToAdd = parseInt(req.body.ammount)
    console.log(ammountToAdd)
    console.log(currentCredit)
    console.log(userID)
    const params = {
        TableName: "usersTable",
        Key:{
        "id": `${userID}`
        },
        UpdateExpression: "set balance = :balance",
        ExpressionAttributeValues: {
        ":balance": currentCredit + ammountToAdd
    },
  };

  docClient.update(params, onUpdate); function onUpdate(err, data) {
    if (err) {
      console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
    } else if(data.Count === 0){
      res.status(404)
      res.send("User not registered, please send post request with following attributes: id, name, email, mobileNumber")
    } else {
        res.cookie("credit", currentCredit + ammountToAdd ,{ expires: new Date(Date.now() + 1120000), httpOnly: true })
      res.status(200)
      res.send(`Balance is now : ${currentCredit + ammountToAdd}.`)
      console.log("Update succeeded.");
    }
  }
});

module.exports = router;




