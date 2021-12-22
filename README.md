# Synoptic
repo for synopticProject API


express server with dynamoDB local for DB 

Local setup requirements

Nodejs v12
java 17+
npm

localDB 

to run local DB 

java -Djava.library.path=../DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb


to run express server:

npm install
npm run start

Testing

Due to time constraints I have elected to forgo unit testing for the sake of ease of development on this MVP.
Unit tests would be realtively easy to add through the use of the NPM package 'supertest'. 
Tests for this API are done through postman app. 
Postman collection can be found in ./Postman
This collection can then be imported into postman and each requet can be manually sent


At present the user can perform a GET request to localhost:3000/ 
    This will return all users in the database - this is implemented for development purposes.

The user can register by performing a POST request to localhost:3000/register
    The user will have to provide the following
 {
    "id": "String",
    "name": "String",
    "email": "String",
    "mobileNumber": "String",
    "pin": int
}
    This will create an entry with the given attributes in the database.

The user can login by performing a GET request to localhost:3000/login/<UserID>/<UserPIN>
    This will return "Hello <name>"
    The server then sets four different cookies; "credit", "name", "userID", and "loggedIn".

    If the user provides the incorrect PIN they are sent statusCode 403 (Forbidden) and told the pin is incorrect. 

The user can topUp their balance after logging in by performing a POST request to localhost:3000/topup
    The user will have to provide the following in the POST request body 
    {
        "ammount": Int
    }

The user can then purchase by performing a POST request to localhost:3000/payment
    The user will have to provide the follow in the POST request body
    {
        "ammount": Int
    }

The user can then logout by performing a second GET request to localhost:3000/login/<UserID>/<UserPIN>
    This will return "Goodbye <name>"
    The server will then destory all 4 cookies which it previously issued.

Going foward 

 At present this app is an express server which is connected to an in-memory dynamoDB instance. 
 This could be run almost as is using cloud compute infrastructure such as EC2.
 But a more radical change could be to move the entire API to serverless architecture;
    This could be achieved by utilizing a cloud provider such as Azure/AWS and running the logic in serverless functions e.g AWS lambda.
    To complement this approach we could host the dynamoDB database in the cloud too, using AWS's dynamodb offering.
    and use API gateway to route requests and authenticate users. 

Given more time I would have liked to refactor the project by spliting the dynamoDB functions into seperate files. This would make the overall structure of the API much more managable and easier to comprehend and read. 
It would also allow for the reuse of certain pieces of code, where currently there is significant duplication.

