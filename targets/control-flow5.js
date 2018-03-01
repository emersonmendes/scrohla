"use strict";

const target = {
    url : "https://www.whatismybrowser.com/detect/what-is-my-user-agent",
    execute : collect
};

let sendResult;
let driver;
let By;
let until;
let flow;
    
let result = {};

function endCollect(){
    flow.execute( () => {
        console.log("LOG QUE TA DENTRO DA PROMISE E NO CONTROL FLOW [ 3 ]")
        // soma porcentagem de protestantes + catolicos
        result.catolicosMaisProtestantes = Number(result.catolicos) + Number(result.protestantes);
        // Concatena tudo
        result.TUDO = `País: ${result.pais} | Capital: ${result.capital} | Catolicos(%): ${result.catolicos} | Protestantes(%): ${result.protestantes} | Total(%): ${result.catolicosMaisProtestantes}`;
        // Envia o resultado para algum lugar
        sendResult(result);
    });
}

function collect(scrohla, _sendResult){

    sendResult = _sendResult;

    // Abstração
    driver = scrohla.getDriver();
    By = scrohla.getBy();
    until = scrohla.until();
    flow = scrohla.getWebdriver().promise.controlFlow();

    // :)
    // ==========================================================

    flow.execute( () => console.log("LOG QUE TA NO CONTROL FLOW [ 1 ]") )

    // Entra no website
    driver.get("https://www.wikipedia.org/");
    
    // Pega o elemento do Input
    driver.findElement(By.xpath("//*[@id='searchInput']")).then( inputElm =>  {
        inputElm.click(); // Clica no elemento do Input ( Não precisaria eu sei >.> )
        inputElm.sendKeys("Brasil"); // Digita no elemento do Input
        console.log("LOG QUE TA DENTRO DA PROMISE E NO CONTROL FLOW [ 2 ]")
    });
    
    // clica o elemento do botão
    driver.findElement(By.xpath("//button[@type='submit']")).then( btnElm => btnElm.click());

    // pega o elemento do nome do país
    driver.findElement(By.xpath("//tbody//tr//th//span[@lang='pt']//i"))
        .then( countryElm => countryElm.getText() )
        .then( txt => result.pais = txt );

    // pega o elemento da capital
    driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[7]/td/a"))
        .then( capitalElm => capitalElm.getText() )
        .then( txt => result.capital = txt );

    // pega o elemento da porcentagem de catolicos
    driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[1]"))
        .then( catholicElm => catholicElm.getText() )
        .then( txt => result.catolicos = txt.split("%")[0] );

    // pega o elemento da porcentagem de protestantes
    driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[2]"))
        .then( protestantElm => protestantElm.getText() )
        .then( txt => result.protestantes = txt.split("%")[0] );

    endCollect();

    console.log("LOG QUE NAO TA NO CONTROL FLOW [ 4 ]");

    // ==========================================================

}    

exports.target = target;