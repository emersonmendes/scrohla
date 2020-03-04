"use strict";

const CODIGO = "e4ww99cjk79w";

const target = {
    url: "https://www.nescafe-dolcegusto.com.br/mybonus/",
    execute: collect
};

function collect(scrohla, sendResult) {

    let result = {};

    scrohla.authenticate({
        loginURL: target.url,
        credentialsName: 'dolcegusto',
        user: { xpath: "//input[@id='email']" },
        pass: { xpath: "//input[@id='pass']" },
        beforeLogin: () => {
            scrohla.mouseMoveTo("//div[@id='header-account']");
        },
        cookies: true
    });

    scrohla.start();

    scrohla.type(CODIGO.replace(/ /g, "").toUpperCase(), "//input[@id='coupon_code']");
    scrohla.click("//*[@id='pcm-codes-form']//button");

    scrohla.waitForLocated("//*[@class='error-msg']", 1505000)
        .then(() => {
            result.erro = `Codigo ${CODIGO} está inválido ou já foi utilizado!`;
        })
        .catch(() => {
            result.msg = `Codigo ${CODIGO} inserido com sucesso!`;
        });

    scrohla.flow(() => sendResult(result));

}

exports.target = target;




