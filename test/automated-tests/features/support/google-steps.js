const { When, Then } = require("cucumber");

When("I search for something", function(){
    this.scrohla.goTo("https://google.com");
    return this.scrohla.type("Bob Marley", "//*[@id='lst-ib']");
});

Then("I press ENTER", {timeout: 60 * 1000} , function(){
    return this.scrohla.type(this.scrohla.getKey().ENTER, "//*[@id='lst-ib']");
});
