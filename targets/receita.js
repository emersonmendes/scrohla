"use strict";

const data = require("./credentials.json").receita;
const { CookieManager } = require("../src/cookie-manager");

const target = {
    //url : "http://www22.receita.fazenda.gov.br/inscricaomei/private/pages/certificado_acesso.jsf",
    url: "http://www22.receita.fazenda.gov.br/inscricaomei/private/pages/certificado_acesso.jsf;jsessionid=589CD0D1D8C9467A10AA3E31B1CA0C09.node4",
    execute: collect
};

function collect(scrohla, sendResult) {

    let result = {
        result: "sucess!"
    };

    scrohla.start();

    const cookies = `${data.cpf}`;
    const cookieManager = new CookieManager(cookies, scrohla.getDriver());

    if (cookieManager.exists()) {
        scrohla.logInfo(`Using cookies: ${cookies}`);
        scrohla.flow(() => cookieManager.inject(() => scrohla.reload()));
        scrohla.sleep(20000);
    } else {
        scrohla.logInfo("Normal access ...");
        scrohla.type(data.cpf, "//input[@id='meiMB_cpf']");
        scrohla.type(data.nascimento, "//input[@id='meiMB_dataNascimento']");
        scrohla.sleep(20000);
        scrohla.flow(() => cookieManager.store());
    }

    scrohla.flow(() => sendResult(result));

}

exports.target = target;
