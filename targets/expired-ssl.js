"use strict";

const target = {
  url : "https://expired.badssl.com/",
  execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.start();  
    
    scrohla.takeScreenshot();

    scrohla.getText("//body").then( text => {
        result.text = text.replace("\n"," ");
    });

    scrohla.takeScreenshot();

    scrohla.flow( () => sendResult(result) );

}

exports.target = target;