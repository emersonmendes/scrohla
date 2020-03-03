"use strict";

const logger = require("../src/logger");

const target = {
    url: "https://www.submarino.com.br/produto/9417912",
    key: "submarino_products",
    execute: collect
};

async function getPrice(scrohla){

    let price = "";

    try {
        price = await scrohla.getText("//span[contains(@class,'price__SalesPrice')]");
    } catch (e) {
        logger.warn('Não achou a classe price__SalesPrice, tentando por sales-price!');
        price = await scrohla.getText("//span[contains(@class,'sales-price')]");
    }

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




