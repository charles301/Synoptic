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


to run express server

npm install
npm run start

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


    Create documentation to describe what the API will do 
and how it will work. This is likely to include:
• Any assumptions made about the requirements
• Any changes or additions made to the requirements
• Textual and/or diagrammatic documentation of 
design elements, including use cases and/or 
sequence diagrams where appropriate
• A data mode

