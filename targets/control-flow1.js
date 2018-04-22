"use strict";

const target = {
    url : "https://www.whatismybrowser.com/detect/what-is-my-user-agent",
    execute : collect
};

function collect(scrohla, sendResult){

    // Abstração
    const driver = scrohla.getDriver();
    const By = scrohla.getBy();

    // como nao fazer
    // INICIAL
    // ==========================================================
   
    let result = {};

    driver.get("https://www.wikipedia.org/").then( () => {
        driver.findElement(By.xpath("//*[@id='searchInput']")).then( inputElm => {
            inputElm.click().then( () => {
                inputElm.sendKeys("Brasil").then( () => {
                    driver.findElement(By.xpath("//button[@type='submit']")).then( btnElm => {
                        btnElm.click().then( () => {
                            
                            driver.findElement(By.xpath("//tbody//tr//th//span[@lang='pt']//i"))
                                .then( countryElm => {
                                    countryElm.getText().then( country => {
                                        result.pais = country;
                                    });
                                });
                            
                            driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[7]/td/a"))
                                .then( capitalElm => {
                                    capitalElm.getText().then( capital => {
                                        result.capital = capital;
                                    });
                                });

                            driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[1]"))
                                .then( catholicElm => {
                                    catholicElm.getText().then( catholic => {
                                        result.catolicos = catholic.split("%")[0];
                                        driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[2]"))
                                        .then( protestantElm => {
                                            protestantElm.getText().then( protestant => {                                          
                                                result.protestantes = protestant.split("%")[0];
                                                result.catolicosMaisProtestantes = Number(result.catolicos) + Number(result.protestantes);
                                                sendResult(result);
                                            });
                                        });

                                    });
                                });

                        });
                    });
                });
            });
        });
    });

    // ==========================================================

}    

exports.target = target;