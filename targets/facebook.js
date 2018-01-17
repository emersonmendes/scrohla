"use strict";

const credentials = require("./credentials.json").facebook;

const target = {
    url : "https://www.facebook.com/pg/FlamengoOficial",
    loginURL : "https://www.facebook.com/",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.authenticate({
        loginURL: target.loginURL,
        user : { 
            xpath : "(//input[ @type='email' ])[1]", 
            data : credentials.user
        },
        pass : { 
            xpath : "(//input[@type='password'])[1]", 
            data : credentials.pass
        },
        cookies : true
    });
    
    scrohla.start();       

    scrohla.waitFor("//*[@data-click='profile_icon']");  
   
    scrohla.getText("//h1[@id='seo_h1_tag']").then( text => {
        result.fullName = text;
    });

    scrohla.getText("//h1[@id='seo_h1_tag']").then( text => {
        result.fullName = text;
    });

    scrohla.flow(() => sendResult(result));

}

exports.target = target;