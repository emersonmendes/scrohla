"use strict";

const credentials = require("./credentials.json").facebook;

const target = {
    //url : "https://www.facebook.com/1548217425497632/photos/p.1553682101617831/1553682101617831",
    url : "https://www.facebook.com/1548217425497632/photos/pcb.1553581334961241/1553581274961247",
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
        }
    });
    
    scrohla.start();       

    scrohla.waitFor("//*[@class='stageWrapper lfloat _ohe']");  

    scrohla.executeJs(function(){
        var elemento = document.evaluate(arguments[0], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var evento = document.createEvent("Events");
        evento.initEvent("click", true, false);
        elemento.dispatchEvent(evento);
    },"(//div[@class='permalinkPost']//a[contains(@rel,'theater') and @class='_5dec _xcx'])[last()] | (//div[@class = '_2eec']//img)[1]|(//a[contains(@rel,'theater') and @class='_5dec _xcx'])[last()] | (//div[@class = '_2eec']//img)[1]");

    scrohla.flow(() => sendResult(result));

    scrohla.quit();

}

exports.target = target;