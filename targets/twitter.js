"use strict";

const credentials = require("./credentials.json").twitter;

const target = {
    url : "https://www.twitter.com/flamengo",
    loginURL : "https://twitter.com/login",
    execute : collect
};

function collect(scrohla, sendResult){

    scrohla.authenticate({
        loginURL: target.loginURL,
        user :{ 
            xpath : "//input[ @class='js-username-field email-input js-initial-focus' ]", 
            data : credentials.user
        },
        pass : { 
            xpath : "//input[@class='js-password-field']", 
            data : credentials.pass
        },
        cookies : true
    });
    
    scrohla.start();
        
    scrohla.waitFor("//*[@class='me dropdown session js-session']");  
    
    let result = {};

    scrohla.getText("//*[contains(@class,'ProfileHeaderCard-name')]//a").then( text => {
        result.name = text;
    });

    scrohla.getText("//*[contains(@class,'ProfileHeaderCard-bio')]").then( text => {
        result.bio = text;
    });

    scrohla.getText("//*[contains(@class,'ProfileHeaderCard-location')]").then( text => {
        result.location = text;
    });

    scrohla.getText("//*[contains(@class,'ProfileHeaderCard-urlText')]").then( text => {
        result.website = text;
    });

    scrohla.flow(() => sendResult(result));

}

exports.target = target;