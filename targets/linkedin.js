"use strict";

const credentials = require("./credentials.json").linkedin;

const target = {
    url : "https://www.linkedin.com/in/williamhgates/",
    loginURL : "https://www.linkedin.com/uas/login",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.authenticate({
        loginURL: target.loginURL,
        user : { 
            xpath : "(//input[ @id='session_key-login' ])[1]", 
            data : credentials.user
        },
        pass : { 
            xpath : "(//input[@type='password'])[1]", 
            data : credentials.pass
        },
        cookies : true
    });
    
    scrohla.start();       

    scrohla.takeScreenshot();
    scrohla.getText("//h1[contains(@class,'pv-top-card-section__name')]").then( name => {
        result.nome = name;
    }).catch( () => scrohla.takeScreenshot());
    
    scrohla.getText("//h2[contains(@class,'pv-top-card-section__headline')]").then( headline => {
        result.cargo = headline;
    }).catch( () => scrohla.takeScreenshot());
    
    scrohla.getText("//h3[contains(@class,'pv-top-card-section__location ')]").then( location => {
        result.localizacao = location;
    }).catch( () => scrohla.takeScreenshot());

    scrohla.flow(() => sendResult(result));

}

exports.target = target;