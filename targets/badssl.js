"use strict";

// varios testes no site https://badssl.com/

const target = {
    url: "https://self-signed.badssl.com/",
    execute: collect
};

async function collect(scrohla, sendResult) {

    let result = {};

    await scrohla.start();

    result.text = await scrohla.getText("//body");
    result.text = result.text.replace("\n", " ");

    await scrohla.takeScreenshot();

    sendResult(result);

}

exports.target = target;
