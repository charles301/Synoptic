const express = require('express');
const AWS = require("aws-sdk");

const router = express.Router();

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

router.post('/', function (req, res, next) {

  const userID = req.cookies.userID
  const currentCredit = parseInt(req.cookies.credit)
  const ammountToSubtract = parseInt(req.body.ammount)
  if ((currentCredit - ammountToSubtract) < 0) {
    res.status(418)
    res.send("Insufficient balance")
  } else {
    const params = {
      TableName: "usersTable",
      Key: {
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
      } else if (data.Count === 0) {
        res.status(404)
        res.send("User not registered, please send post request with following attributes: id, name, email, mobileNumber")
      } else {
        res.cookie("credit", currentCredit - ammountToSubtract, { expires: new Date(Date.now() + 1120000), httpOnly: true })
        res.status(200)
        res.send(`Balance is now: ${currentCredit - ammountToSubtract}`)
        console.log("Scan succeeded.");
      }
    }
  }
});

module.exports = router;




