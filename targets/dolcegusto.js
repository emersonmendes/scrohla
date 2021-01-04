"use strict";

const CODIGO = "e4ww99cjk79w";

const target = {
    url: "https://www.nescafe-dolcegusto.com.br/reward/customer/info/",
    execute: collect
};

async function collect(scrohla, sendResult) {

    let result = {};

    const authData = {
        loginURL: 'https://www.nescafe-dolcegusto.com.br/customer/account/login',
        credentialsName: 'dolcegusto',
        user: { xpath: "//input[@id='email']" },
        pass: { xpath: "//input[@id='pass']" },
        cookies: false
    };

    await scrohla.authenticate(authData);
    await scrohla.start();
    await scrohla.type(CODIGO.replace(/ /g, "").toUpperCase(), "//input[@id='code']");
    await scrohla.click("//*[@id='reward-pcm-form']//button");

    let error = "";

    try {
        error = await scrohla.waitForLocated("//*[@data-ui-id='message-error']", 1505000);
        if(error){
            result.erro = `Codigo ${CODIGO} está inválido ou já foi utilizado!`;
        }
    } catch(e) {
        result.msg = `Codigo ${CODIGO} inserido com sucesso!`;
    }

    sendResult(result);

}

exports.target = target;
