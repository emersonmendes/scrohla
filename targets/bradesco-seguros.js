"use strict";

const target = {
    url : "http://www.bradescoseguros.com.br/wps/portal/TransforDigital/Site/Inicio/AssistenciaTotal/medicos",
    execute : collect
};

const modalLoadingXPATH = "//*[contains(@class,'modal-carregando')]";
const resultadoReferenciadoXPATH = "//*[@id='resultado-referenciado']//div";

const state = "sao paulo"; 
const city = "sao paulo"; 

let scrohla;
let result = { clinicas : [] };

function collect(_scrohla, sendResult){

    scrohla = _scrohla;
   
    scrohla.start();    
    
    scrohla.flow(() => console.timeEnd('Tempo Execução'));
    
    scrohla.click("(//*[@id='lista-redes']//*[contains(@class,'listagens-busca')]//li)[1]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 

    scrohla.type(state, "//input[@id='filtroEstado']");
    
    scrohla.click("(//*[@id='lista-estado']//*[contains(@class,'listagens-busca')]//li)[1]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 

    scrohla.type(city, "//input[@id='filtroCidade']");

    scrohla.click("(//*[@id='lista-cidade']//*[contains(@class,'listagens-busca')]//li)[1]");

    scrohla.click("//*[@id='lista-tipo-pesquisa' and contains(@class,'ativo')]//table//input[contains(@id,'formInicio:tipoPesquisa:0')]");

    /** 
     * Espera 15 segundos para digitar o captcha manualmente 
     * */
    scrohla.sleep(15000);

    scrohla.click("//*[@id='btnContinuar']//a");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
    
    scrohla.waitFor("//div[@id='painel-busca']");   

    scrohla.click("(//*[contains(@class,'itemTipoEstabelecimento')]//a)[4]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
    
    scrohla.click("(//*[contains(@class,'itemEspecialidade')]//a)[1]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
    
    scrohla.click("(//*[contains(@class,'itemBairroReferenciado')]//a)[2]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
        
    scrohla.log("Chegou nos resultados!");
    
    scrohla.waitForVisible(resultadoReferenciadoXPATH); 

    scrohla.findElements(resultadoReferenciadoXPATH).then(elements => {
        const length = elements.length;
        scrohla.log(`Achou ${length} elementos...`);
        for(let i = 1; i <= elements.length;i++){
            iterateOverElements(i);
        }
    });

    scrohla.flow(() => sendResult(result));

    scrohla.flow(() => console.timeEnd('Tempo Execução'));

    scrohla.quit();

}

function iterateOverElements(i){
    scrohla.log(`Pegando o elemento número: ${i}`);
    scrohla.click(`(//*[@id='resultado-referenciado']//div)[${i}]`);
    scrohla.waitForNotVisible(modalLoadingXPATH);       
    scrohla.getText("//*[@class='detalhe-razao-social']").then(txt => result.clinicas.push(txt));
    scrohla.click("//*[@class='detalhe-topo']//a");
    scrohla.waitForNotVisible(modalLoadingXPATH);
}

exports.target = target;