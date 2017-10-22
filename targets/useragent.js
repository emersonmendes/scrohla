"use strict";

const target = {
    url : "https://www.whatismybrowser.com/detect/what-is-my-user-agent",
    execute : collect
};

function collect(scrohla, sendResult){

    scrohla.start();

    let result = {
        url : scrohla.getCurrentURL()
    };

    scrohla.getText("//div[@class='content']//div[@class='detected_result']//a").then( userAgent => {
        result.userAgent = userAgent;
    });

    scrohla.flow( () => {
        sendResult(result);
    });

    scrohla.quit();

}    

exports.target = target;