'use strict';

const logger = require('winston');

const target = {
    url : "http://phantomjs.org/",
    key : "",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.start();

    scrohla.getText("//div[@class='grid_7 alpha']//h1").then( text => {
        result.phantomInfo = text;
        logger.info(text);
    });

    scrohla.flow( () => {
        sendResult(result);
    });

}    

exports.target = target;