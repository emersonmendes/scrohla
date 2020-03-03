"use strict";

const credentials = require("./credentials.json").linkedin;

const target = {
    url: "https://www.linkedin.com/in/williamhgates/",
    loginURL: "https://www.linkedin.com/uas/login",
    execute: collect
};

const authData = {
    loginURL: target.loginURL,
    user: {
        xpath: "(//input[ @id='username' ])[1]",
        data: credentials.user
    },
    pass: {
        xpath: "(//input[@id='password'])[1]",
        data: credentials.pass
    },
    cookies: false
};

async function collect(scrohla, sendResult) {

    let result = {};

    await scrohla.authenticate(authData);
    await scrohla.start();
    await scrohla.takeScreenshot();

    result.nome = await scrohla.getText("(//*[contains(@class,'t-24')])[1]");
    result.cargo = await scrohla.getText("(//*[contains(@class,'t-18')])[1]");
    result.localizacao = await scrohla.getText("(//*[contains(@class,'t-16')])[1]");

    sendResult(result);

}

exports.target = target;
