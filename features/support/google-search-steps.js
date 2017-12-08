const { Scrohla } = require("../../src/scrohla");
const { When } = require("cucumber");

const scrohla = new Scrohla({
    targetURL: "https://google.com",
    targetName: "google"
});

When("I search for something", function(){
    return scrohla.goTo("https://google.com");
});