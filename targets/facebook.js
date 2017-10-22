"use strict";

const credentials = require("./credentials.json").facebook;

const target = {
    url : "https://www.facebook.com/",
    auth :{ 
        host : "facebook",
        user : credentials.user,
        pass : credentials.password
    },
    execute : collect
};

function collect(scrohla, sendResult){
    let result = { 
        "socialMedia" :  target.auth.host
    };
    scrohla.start();
    scrohla.authenticate(target.auth);
    scrohla.flow(() => sendResult(result));
}

exports.target = target;