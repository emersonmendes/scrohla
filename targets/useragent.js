"use strict";

const target = {
    url : "https://www.whatismybrowser.com/detect/what-is-my-user-agent",
    execute : collect
};

function collect(scrohla, sendResult){

    scrohla.start();

    let result = {};

    scrohla.getText("//div[@class='content']//div[@class='detected_result']//a").then( userAgent => {
        result.userAgent = userAgent;
    });

    scrohla.takeScreenshot();

    scrohla.flow( () => {
        sendResult(result);
    });

}    

exports.target = target;