const AWS = require("aws-sdk");
const express = require('express');

const router = express.Router();

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/:id/:pin', function (req, res, next) {
  const userID = req.params.id
  const userPIN = req.params.pin
  if (req.cookies.loggedIn) {
    const name = req.cookies.name
    res.clearCookie("userID")
    res.clearCookie("credit")
    res.clearCookie("loggedIn")
    res.clearCookie("name")
    res.send(`Goodbye ${name}`)
  } else {

    if (req.params.pin === undefined) {
      res.send("Please provide a PIN")
    }
    const params = {
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
      } else if (data.Count === 0) {
        res.status(404)
        res.send("User not registered, please send post request to '/register' with following attributes: id, name, email, mobileNumber")
      } else {
        if (userPIN == data.Items[0].pin) {
          res.cookie("userID", userID, { expires: new Date(Date.now() + 120000), httpOnly: true })
          res.cookie("credit", data.Items[0].balance, { expires: new Date(Date.now() + 120000), httpOnly: true })
          res.cookie("name", data.Items[0].name, { expires: new Date(Date.now() + 120000), httpOnly: true })
          res.cookie("loggedIn", true, { expires: new Date(Date.now() + 120000), httpOnly: true })
          res.send(`Welcome ${data.Items[0].name}`)
          console.log("Scan succeeded.");
        } else {
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
}
);
module.exports = router;
