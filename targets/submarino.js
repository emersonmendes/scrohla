"use strict";

const target = {
    url: "https://www.submarino.com.br/produto/9417912",
    key: "submarino_products",
    execute: collect
};

function collect(scrohla, sendResult) {

    let result = {
        url: target.url,
        date: new Date().getTime()
    };

    scrohla.start();

    scrohla.getText("//span[@class='product-id']").then(cod => {
        result.cod = cod && cod.replace(/[^\d]/g, "");
    });

    scrohla.getText("//h1[@class='product-name']").then(name => {
        result.name = name;
    });

    scrohla.getText("//p[@class='sales-price']").then(price => {
        result.price = price && Number(price.replace("R$ ", "").replace(",", "."));
    });

    scrohla.takeScreenshot();

    scrohla.flow(() => {
        sendResult(result);
    });

}

exports.target = target;




