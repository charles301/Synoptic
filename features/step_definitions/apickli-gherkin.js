const { Given, When, Then } = require("cucumber");

module.exports = require("apickli/apickli-gherkin");

Given("I set the correct cookies", function (callback){
    this.apickli.addCookie("name", "Charles Wilson")
})

