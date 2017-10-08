'use strict';

const logger = require('winston');

const target = {
    url : "https://google.com/",
    key : "",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.start();

    scrohla.takeScreenshot();

    scrohla.getText("//div[@class='content']").then( text => {
        result.text = text;
        logger.info(text);
    });

    scrohla.flow( () => {
        sendResult(result);
    });

}    

exports.target = target;