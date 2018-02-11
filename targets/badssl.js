"use strict";

// varios testes no site https://badssl.com/

const target = {
  url : "https://self-signed.badssl.com/",
  execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.start();  

    scrohla.getText("//body").then( text => {
        result.text = text.replace("\n"," ");
    });

    scrohla.takeScreenshot();

    scrohla.flow( () => sendResult(result) );

}

exports.target = target;