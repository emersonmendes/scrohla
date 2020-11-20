"use strict";

const target = {
    url: "https://toptic.topticgo.com/?inviteId=f5cb535a-ab3a-4ede-af6f-19342332f22d",
    execute: collect
};

async function collect(scrohla, sendResult) {

    let result = {};

    await scrohla.start();

    await scrohla.click('/html/body/div/div/div[2]/div/div[2]/div[1]/div/button');

    await scrohla.type('07063259903',"(//input[@name='CPF'])[1]");

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div[1]/div[3]/button');

    await scrohla.type('Joao Canabrava da Silva',"(//input[@name='name'])[1]");
    await scrohla.type('48995959595',"(//input[@name='phoneNumber'])[1]");
    await scrohla.type('48995959595',"(//input[@name='emailAddress'])[1]");

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div[1]/div[3]/button');

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[2]');

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div/div[1]/div[3]/button');


    await scrohla.sleep(4000);


    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div/div[1]/div[3]/button');

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div[1]/div[3]/button');

    await scrohla.sleep(1000);
    
    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div');

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[4]/div[1]/div[3]/button');

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[2]/div[3]/button');

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div[1]/div[3]/button'); 


    await scrohla.sleep(5000);


    await sendResult(result);

}

exports.target = target;




