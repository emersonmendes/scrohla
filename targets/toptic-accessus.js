"use strict";

const axios = require('axios');

const target = {
    url: "https://localhost/accessus/",
    execute: collect,
    groupName: 'Simulator',
    finalDate: '01/06/2023',
    documentList: []
};

const authData = {
    loginURL: target.loginURL,
    credentialsName: 'accessus',
    user: { xpath: '//*[@id="login-username"]' },
    pass: { xpath: '//*[@id="login-password"]' },
    cookies: false
};

async function collect(scrohla, sendResult) {

    await scrohla.start();
    await scrohla.authenticate(authData);
    
    await scrohla.click("/html/body/div[5]/div/div[5]/a[1]");
    await scrohla.goTo(`${target.url}#!/home/access-home`);

    for(const doc of target.documentList){

        await scrohla.waitForNotVisible('//loading-status')

        scrohla.logInfo('--------------------------------------------------');
        scrohla.logInfo(`Iniciando alteração do cadastro: ${doc}`);
        scrohla.logInfo('--------------------------------------------------');

        const inputSearch = '//*[@id="page-wrapper"]/div[2]/ui-view/div/div[1]/div/form/div/div[2]/div/input';
        
        await scrohla.type(doc, inputSearch);
        
        // Pesquisa acesso
        await scrohla.sleep(1000);
        await scrohla.click('//*[@id="access-searchbutton"]');
        
        await scrohla.waitForNotVisible('//loading-status')
        // Clica editar 
        await scrohla.click('//*[starts-with(@id,"access-editbutton-")]');
        
        // Espera abrir modal editar acesso
        await scrohla.waitForNotVisible('//loading-status')
        await scrohla.waitForVisible('//*[@title="appMessage.system.accessus.access.title"]')
        
        // Clica remover grupo
        await scrohla.click('/html/body/div[1]/div/div/form/div[1]/fieldset/div[3]/div/span/span/i');

        // Clica abrir modal novo grupo
        await scrohla.click('//*[@id="access-accessgroupbutton"]');
        

        // Digita novo grupo
        await scrohla.waitForNotVisible('//loading-status')

        const modalGroup = '//h3[text()="Grupo de Acesso"]/parent::div/parent::div';
        await scrohla.type(target.groupName, `${modalGroup}//input[@placeholder="Pesquisar"]`);

        // Digita novo grupo pesquisa novo grupo
        await scrohla.sleep(500);
        await scrohla.click(`${modalGroup}//button[@ng-click="search()"]`);

        // Marca checkbox
        await scrohla.waitForNotVisible('//loading-status')
        await scrohla.click('//*[@type="checkbox"]');

        // Confirma
        await scrohla.click('//*[@id="accessgroup-confirmbutton"]');

        // Insere data final
        await scrohla.waitForNotVisible('//loading-status')
        await scrohla.click('/html/body/div[1]/div/div/form/div[1]/fieldset/div[4]/div[1]/input-date/div/input');
        await scrohla.type(target.finalDate, '/html/body/div[1]/div/div/form/div[1]/fieldset/div[4]/div[1]/input-date/div/input');

        // Salva
        await scrohla.click('/html/body/div[1]/div/div/form/div[2]/div/button[1]');
      
        // Limpa texto pesquisa
        await scrohla.waitForNotVisible('//loading-status')
        await scrohla.clear(inputSearch);

        scrohla.logInfo('--------------------------------------------------');
        scrohla.logInfo(`Finalizou alteração do cadastro: ${doc}`);
        scrohla.logInfo('--------------------------------------------------');

    }
    
    await sendResult({ });

}

exports.target = target;




