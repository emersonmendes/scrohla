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

let scrohla;
    
let result = {
    github : "https://github.com/emersonmendes/scrohla/blob/master/src/scrohla.js"
};

function collect(_scrohla, sendResult){

    scrohla = _scrohla;

    configurar();
    entrarNoSite();
    pesquisar("Brasil");   
    pegaPais();
    pegarCapital();
    pegarPorcentagemCatolicos();
    pegarPorcentagemProtestantes();
    somarPorcentagens();
    concatenarTudo();

    flow.execute(() => sendResult(result));

    console.log("LOG QUE NAO TA NO CONTROL FLOW [ 4 ]");

}    

function entrarNoSite(){
    driver.get("https://www.wikipedia.org/");
}

function pesquisar(txt){
    driver.findElement(By.xpath("//*[@id='searchInput']")).then( inputElm =>  {
        inputElm.click();
        inputElm.sendKeys(txt);
        console.log("LOG QUE TA DENTRO DA PROMISE E NO CONTROL FLOW [ 2 ]");
    });
    driver.findElement(By.xpath("//button[@type='submit']")).then( btnElm => btnElm.click());
}

function pegaPais(){
    driver.findElement(By.xpath("//tbody//tr//th//span[@lang='pt']//i"))
        .then( countryElm => countryElm.getText() )
        .then( txt => result.pais = txt );
}

function pegarCapital(){
    driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[7]/td/a"))
        .then( capitalElm => capitalElm.getText() )
        .then( txt => result.capital = txt );
}

function pegarPorcentagemCatolicos(){
    driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[1]"))
        .then( catholicElm => catholicElm.getText() )
        .then( txt => result.catolicos = txt.split("%")[0] );
}

function pegarPorcentagemProtestantes(){
    driver.findElement(By.xpath("//*[@id='mw-content-text']/div/table[1]/tbody/tr[11]/td/div/ul/li[2]"))
        .then( protestantElm => protestantElm.getText() )
        .then( txt => result.protestantes = txt.split("%")[0] );
}

function somarPorcentagens(){
    flow.execute( () => {
        result.catolicosMaisProtestantes = Number(result.catolicos) + Number(result.protestantes);
    });
}

function concatenarTudo(){
    flow.execute( () => {
        console.log("LOG QUE TA DENTRO DA PROMISE E NO CONTROL FLOW [ 3 ]");
        result.TUDO = `País: ${result.pais} | Capital: ${result.capital} | Catolicos(%): ${result.catolicos} | Protestantes(%): ${result.protestantes} | Total(%): ${result.catolicosMaisProtestantes}`;
    });
}

function configurar(){
    driver = scrohla.getDriver();
    By = scrohla.getBy();
    until = scrohla.until();
    flow = scrohla.getWebdriver().promise.controlFlow();
    flow.execute( () => console.log("LOG QUE TA NO CONTROL FLOW [ 1 ]") );
}

exports.target = target;