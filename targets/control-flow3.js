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
    // QUER CONCATENAR OS DADOS
    // ==========================================================
    
    let result = {};

    // Entra no website
    driver.get("https://www.wikipedia.org/").then( () => {
        // Pega o elemento do Input
        driver.findElement(By.xpath("//*[@id='searchInput']")).then( inputElm => {
            // Clica no elemento do Input ( Não precisaria eu sei >.> )
            inputElm.click().then( () => {
                // Digita no elemento do Input
                inputElm.sendKeys("Brasil").then( () => {
                    // clica o elemento do botão
                    driver.findElement(By.xpath("//button[@type='submit']")).then( btnElm => {
                        // clica no elemento do botão para pequisar
                        btnElm.click().then( () => {

                            // ==========================================================
                            // =========================================== inicio dados =
                            // ==========================================================
                            
                            // pega o elemento do nome do país
                            driver.findElement(By.xpath("//tbody//tr//th//span[@lang='pt']//i"))
                                .then( countryElm => {
                                    // pega o texto do nome do país
                                    countryElm.getText().then( country => {
                                        result.pais = country;

                                        // pega o elemento da capital
                                        driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[7]/td/a"))
                                        .then( capitalElm => {
                                            // pega o texto da capital
                                            capitalElm.getText().then( capital => {
                                                result.capital = capital;
                                            
                                                // pega o elemento da porcentagem de catolicos
                                                driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[1]"))
                                                .then( catholicElm => {
                                                    // pega o texto da porcentagem de catolicos
                                                    catholicElm.getText().then( catholic => {
                                                        result.catolicos = catholic.split("%")[0];
                                                        
                                                        // pega o elemento da porcentagem de protestantes
                                                        driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[2]"))
                                                            .then( protestantElm => {
                                                                // pega o texto da porcentagem de protestantes
                                                                protestantElm.getText().then( protestant => {                                          
                                                                    result.protestantes = protestant.split("%")[0];
                                                                    // soma porcentagem de protestantes + catolicos
                                                                    result.catolicosMaisProtestantes = Number(result.catolicos) + Number(result.protestantes);
                                                                    // Envia o resultado para algum lugar

                                                                    result.TUDO = `País: ${result.pais} | Capital: ${result.capital} | Catolicos(%): ${result.catolicos} | Protestantes(%): ${result.protestantes} | Total(%): ${result.catolicosMaisProtestantes}`;

                                                                    sendResult(result);
                                                                });
                                                            });

                                                    });
                                                });

                                            });
                                        });

                                    });
                                });
                            
                            // ==========================================================
                            // =========================================== fim dados =
                            // ==========================================================

                        });
                    });
                });
            });
        });
    });

    // ==========================================================

}    

exports.target = target;