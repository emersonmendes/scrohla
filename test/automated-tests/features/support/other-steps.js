const { When } = require("cucumber");

When("I run this", function(){
    this.scrohla.goTo("http://www.globo.com/");
});

When("I run that", function(){
    this.scrohla.goTo("http://www.globoesporte.com/flamengo");
});