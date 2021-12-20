const AWS = require("aws-sdk");

const fs = require('fs');

AWS.config.update({
    region: "eu-west-2",
    endpoint: "http://localhost:8000"
});
const docClient = new AWS.DynamoDB.DocumentClient();
    console.log("Importing Users into DynamoDB. Please wait.");
    const users = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
    users.forEach(function(user) {
    console.log(user)
  const params = {
        TableName: "users",
        Item: {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "mobileNumber": user.mobileNumber,
            "balance": user.balance,
        }
    };
    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add User", user.name, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", user.name);
       }
    });
});