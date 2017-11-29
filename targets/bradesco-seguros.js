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
let result = { estabelecimentos : [] };

function collect(_scrohla, sendResult){

    scrohla = _scrohla;
   
    scrohla.start();    
    
    scrohla.flow(() => console.time('# Tempo Execução'));
    
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

    scrohla.click("(//*[contains(@class,'itemTipoEstabelecimento')]//a)[4]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
    
    scrohla.click("(//*[contains(@class,'itemEspecialidade')]//a)[1]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
    
    scrohla.click("(//*[contains(@class,'itemBairroReferenciado')]//a)[2]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 
        
    scrohla.logInfo("Chegou nos resultados!");
    
    scrohla.waitForVisible(resultadoReferenciadoXPATH); 

    scrohla.findElements(resultadoReferenciadoXPATH).then(elements => {
        const length = elements.length;
        scrohla.logInfo(`Achou ${length} elementos...`);
        for(let i = 1; i <= elements.length;i++){
            scrohla.logInfo(`Pegando o elemento número: ${i}`);
            iterateOverElements(i);
        }
    });

    scrohla.flow(() => sendResult(result));

    scrohla.flow(() => console.timeEnd('# Tempo Execução'));

    scrohla.quit();

}

function iterateOverElements(i){

    let estabelecimento = {
        telefones : []
    };
    
    scrohla.click(`(//*[@id='resultado-referenciado']//div)[${i}]`);
    scrohla.waitForNotVisible(modalLoadingXPATH);       
    
    scrohla.findElements("//*[@class='detalhe-tel']//div").then(elements => {
        elements.forEach(tel => tel.getText().then(txt => estabelecimento.telefones.push(txt)));
    });

    scrohla.getText("//*[@class='detalhe-nome']").then(txt => estabelecimento.nome = txt);
    scrohla.getText("//*[@class='detalhe-razao-social']").then(txt => estabelecimento.razaoSocial = txt);
    scrohla.getText("//*[@class='detalhe-end']").then(txt => estabelecimento.endereco = txt);
    scrohla.getText("//*[@class='detalhe-codigo']").then(txt => estabelecimento.codigo = txt);
    scrohla.getText("//*[@class='detalhe-crm-cnpj']").then(txt => estabelecimento.crmCnpj = txt);
    scrohla.getText("//*[@class='detalhe-descricao-tipo']").then(txt => estabelecimento.tipo = txt);
    scrohla.getText("//*[@class='detalhe-codigo']").then(txt => estabelecimento.codigo = txt);
    
    scrohla.click("//*[@class='detalhe-topo']//a");
    scrohla.waitForNotVisible(modalLoadingXPATH);

    scrohla.flow(() => result.estabelecimentos.push(estabelecimento));

}

exports.target = target;