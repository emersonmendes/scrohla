"use strict";

const http = require("http");
const url = require("url");

const target = {
    url : "http://www.bradescoseguros.com.br/wps/portal/TransforDigital/Site/Inicio/AssistenciaTotal/medicos",
    execute : collect
};

const modalLoadingXPATH = "//*[contains(@class,'modal-carregando')]";
const resultadoReferenciadoXPATH = "//*[@id='resultado-referenciado']//div";
const itemTipoEstabelecimentoXPATH = "(//*[contains(@class,'itemTipoEstabelecimento')]//a)[4]";

const captchImageEndpoint = "/captchImage";
const sendCaptchaTextEndpoint = "/sendCaptchaText";
const captchaServicePort = 3001;

let captchaImageURL = "";

const state = "sao paulo"; 
const city = "sao paulo"; 

let scrohla;
let result = { estabelecimentos : [] };

function collect(_scrohla, sendResult){

    scrohla = _scrohla;
   
    scrohla.start();    
    scrohla.logInfo("Iniciando coleta...");

    scrohla.takeScreenshot();
        
    scrohla.click("(//*[@id='lista-redes']//*[contains(@class,'listagens-busca')]//li//a)[1]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 

    scrohla.type(state, "//input[@id='filtroEstado']");
    
    scrohla.click("(//*[@id='lista-estado']//*[contains(@class,'listagens-busca')]//li//a)[1]");
    scrohla.waitForNotVisible(modalLoadingXPATH); 

    scrohla.type(city, "//input[@id='filtroCidade']");

    scrohla.click("(//*[@id='lista-cidade']//*[contains(@class,'listagens-busca')]//li//a)[1]");

    scrohla.click("//*[@id='lista-tipo-pesquisa' and contains(@class,'ativo')]//table//input[contains(@id,'formInicio:tipoPesquisa:0')]");

    scrohla.getAttrib("//div[@id='captchaContainer']//img","src").then(txt => captchaImageURL = txt);

    scrohla.flow(() => createResolveCaptchaService());
    
    scrohla.click(itemTipoEstabelecimentoXPATH);
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

    endCollect(sendResult);

}

function endCollect(sendResult){
    scrohla.flow(() => sendResult(result));
}

function createResolveCaptchaService(){
    return new Promise( (resolve, reject) => {
        
        scrohla.logInfo("Aguardando resolução do captcha por 5 minutos");
        scrohla.logInfo(`Acesse http://localhost:${captchaServicePort}${captchImageEndpoint} para ver o captcha.`);
        scrohla.logInfo(`Acesse http://localhost:${captchaServicePort}${sendCaptchaTextEndpoint}?captchaText=Em3RS05 para evnviar texto do captcha.`);

        setTimeout(() => reject(), 300000);

        http.createServer((req, res) => {

            if(req.url === captchImageEndpoint){
                res.setHeader("Content-Type", "text/html");
                res.end(`<img src="${captchaImageURL}" width="290" height="81">`);
            }

            if(req.url.startsWith(sendCaptchaTextEndpoint)){
                resolveCaptcha(res, req, resolve, reject);
            }

        }).listen(captchaServicePort);

    });
}

function resolveCaptcha(res, req, resolve, reject){
    
    const queryParams = url.parse(req.url,true).query;
    const captchaText = queryParams.captchaText;

    !captchaText && reject();

    scrohla.logInfo(`Texto "${captchaText}" recebido...`);
    scrohla.type(captchaText, "//input[contains(@id,'formInicio:txtCaptchaBusca')]");

    scrohla.click("//*[@id='btnContinuar']//a");
    scrohla.waitForNotVisible(modalLoadingXPATH);

    scrohla.waitFor(itemTipoEstabelecimentoXPATH,5000).then(()=>{
        scrohla.logInfo("Digitou certo miseravi!");
        resolve(); 
    }).catch(() => {
        scrohla.takeScreenshot();
        scrohla.logInfo(`O texto: ${captchaText} está errado, atualize a imagem e tente novamente`);
    });
    
    res.setHeader("Content-Type", "text/plain");
    res.end("O texto foi enviado com sucesso, aguarde a resposta...");

}

function iterateOverElements(i){

    let estabelecimento = { telefones : [] };
    
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