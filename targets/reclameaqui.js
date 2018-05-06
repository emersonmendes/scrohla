"use strict";

const target = {
    url: "https://www.reclameaqui.com.br/empresa/nubank/",
    execute: collect
};

function collect(scrohla, sendResult) {

    const driver = scrohla.getDriver();
    const By = scrohla.getBy();

    // teste inicio carregamento pagina
    driver.manage().timeouts().pageLoadTimeout(30000);

    scrohla.start();

    let result = {};

    driver.findElement(By.xpath("//*[contains(@class,'business-seal')]//p"))
        .then(e => e.getText())
        .then(t => result.qualidade = t);

    const brandLogoXpath = "//*[@class='brand-logo']";

    scrohla.isElementVisible(brandLogoXpath)
        .then(isVisible => result.isBrandLogoVisible = isVisible);
    scrohla.isElementNotVisible(brandLogoXpath)
        .then(isNotVisible => result.isBrandLogoNotVisible = isNotVisible);
    scrohla.isElementLocated(brandLogoXpath)
        .then(isLocated => result.isBrandLogoLocated = isLocated);

    scrohla.isElementVisible(brandLogoXpath, 10)
        .then(isVisible => result.isBrandLogoVisibleWith10ms = isVisible);
    scrohla.isElementNotVisible(brandLogoXpath, 10)
        .then(isNotVisible => result.isBrandLogoNotVisibleWith10ms = isNotVisible);
    scrohla.isElementLocated(brandLogoXpath, 10)
        .then(isLocated => result.isBrandLogoLocatedWith10ms = isLocated);

    scrohla.flow(() => result.response = "Success!");

    scrohla.takeScreenshot();

    scrohla.flow(() => sendResult(result));

}

exports.target = target;
