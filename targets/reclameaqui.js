"use strict";

const target = {
    url : "https://www.reclameaqui.com.br/empresa/nubank/",
    execute : collect
};

function collect(scrohla, sendResult){

    const driver = scrohla.getDriver();
    const By = scrohla.getBy();
    const until = scrohla.until();

    // teste inicio carregamento pagina
    driver.manage().timeouts().pageLoadTimeout(30000);

    scrohla.start();

    let result = {};

    driver.findElement(By.xpath("//*[contains(@class,'business-seal')]//p"))
        .then( e => e.getText() )
        .then( t => result.qualidade = t );

    var complainings = driver
        .wait(until.elementLocated(By.xpath("//*[contains(@class,'all-complaintsx')]//*[contains(@class,'medium-title')]")),10000)
        .then( success => true, error => false );

    scrohla.flow( () => {
        complainings.then( x => console.log(x) );
        
    });

    scrohla.takeScreenshot();

    scrohla.flow( () => sendResult(result));

}    

exports.target = target;