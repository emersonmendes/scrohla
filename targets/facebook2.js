"use strict";

const credentials = require("./credentials.json").facebook;

const url = "https://www.facebook.com";

const target = {
    url : `${url}/203326359677581/posts`,
    loginURL : url,
    execute : collect
};

let scrohla;
let lastPost = 0;

const postXpath = "//*[contains(@class,'userContentWrapper')]";

const textToStop = "Para o reitor da Universidade Federal";

function collect(_scrohla, sendResult){

    scrohla = _scrohla;

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
    
    iterateOverPosts(sendResult);

}

function iterateOverPosts(sendResult){
    
    scrohla.scrollToPageBottom();
    
    scrohla.sleep(3000);

    scrohla.findElements(postXpath).then(elements => {
    
        scrohla.logInfo(`Coletando do post ${lastPost + 1} ao ${elements.length}`);
        
        for(let i = lastPost; i < elements.length; i++){
            checkText(elements[i], sendResult);
        }
        
        iterateOverPosts(sendResult);    
        
        lastPost = elements.length;

    });

}

function checkText(element, sendResult){
    scrohla.findElement(element,".//*[contains(@class,'_1dwg')]").getText().then( text => {
        scrohla.logInfo("=========================================================================================");
        scrohla.logInfo(`Texto: ${text}`);
        if(text.includes(textToStop)){
            scrohla
                .findElement(element,"(.//*[contains(@id,'feed_subtitle_')]//span//span/a[@target])[1]")
                .getAttribute("href")
                .then( url => sendResult({ 
                    text : text, 
                    url : url 
                }));
        }
    });
}

exports.target = target;