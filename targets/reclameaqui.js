"use strict";

const target = {
    url: "https://www.reclameaqui.com.br/empresa/nubank/",
    execute: collect
};

async function collect(scrohla, sendResult) {

    const driver = scrohla.getDriver();
    const By = scrohla.getBy();

    await scrohla.start();

    let result = {};

    const scoreElem = await driver.findElement(By.xpath("//span[contains(@class,'current-score')]"));
    result.score = await scoreElem.getText();

    result.response = "Success!"

    await scrohla.takeScreenshot();

    sendResult(result);

}

exports.target = target;
