"use strict";

const credentials = require("./credentials.json").facebook;

const target = {
    url : "https://www.facebook.com/pg/FlamengoOficial",
    auth :{ 
        user : credentials.user,
        pass : credentials.password
    },
    execute : collect
};

function collect(scrohla, sendResult){

    scrohla.start();
    scrohla.authenticate(target.auth);
        
    let result = {};

    scrohla.waitFor("//*[@data-click='profile_icon']");  
   
    scrohla.getText("//h1[@id='seo_h1_tag']").then( text => {
        result.fullName = text;
    });

    scrohla.getText("//h1[@id='seo_h1_tag']").then( text => {
        result.fullName = text;
    });

    scrohla.flow(() => { 
        sendResult(result);
    });

}

exports.target = target;