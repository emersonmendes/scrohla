"use strict";

const logger = require("../src/logger");

const target = {
    url: "https://www.submarino.com.br/produto/1838060832",
    key: "submarino_products",
    execute: collect
};

async function getPrice(scrohla){
    const price = await scrohla.getText("//span[contains(@class,'price__SalesPrice')]");
    return Number(price.replace("R$ ", "").replace(",", "."));
}

async function collect(scrohla, sendResult) {

    let result = {
        url: target.url,
        date: new Date().getTime()
    };

    await scrohla.start();

    result.cod = target.url.replace(/[^\d]/g, "");
    result.name = await scrohla.getText("//h1[@id='product-name-default']");
    result.price = await getPrice(scrohla);

    scrohla.takeScreenshot();

    sendResult(result);

}

exports.target = target;




