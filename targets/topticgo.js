"use strict";

const axios = require('axios');

const target = {
    url: "https://toptic.topticgo.com/?inviteId=f5cb535a-ab3a-4ede-af6f-19342332f22d",
    execute: collect
};


function randomize(n) {
    var ranNum = Math.round(Math.random()*n);
    return ranNum;
}

function mod(dividendo,divisor) {
    return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
}

function genDocNumber() {
  
    var n = 9;

    var n1 = randomize(n);
    var n2 = randomize(n);
    var n3 = randomize(n);
    var n4 = randomize(n);
    var n5 = randomize(n);
    var n6 = randomize(n);
    var n7 = randomize(n);
    var n8 = randomize(n);
    var n9 = randomize(n);

    var d1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10;
    d1 = 11 - ( mod(d1,11) );
    if (d1>=10){
        d1 = 0;
    } 
    var d2 = d1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11;
    d2 = 11 - ( mod(d2,11) );
    if (d2>=10) {
        d2 = 0;
    }
        
    return ''+n1+n2+n3+n4+n5+n6+n7+n8+n9+d1+d2;
    
}
async function collect(scrohla, sendResult) {

    let result = {};

    await scrohla.start();

    await scrohla.click('/html/body/div/div/div[2]/div/div[2]/div[1]/div/button');

    const response = await axios.get('https://randomuser.me/api/?nat=us,br,gb,es,nz');

    const person = response.data.results[0]; 

    result.name = person.name.first + " " + person.name.last;
    result.email = person.email;
    result.docNumber = genDocNumber();
    result.phoneNumber = Math.round(Math.random() * 100000000000);

    await scrohla.type(result.docNumber,"(//input[@name='CPF'])[1]");

    await scrohla.click('//*[@id="root"]/div/div[2]/div/div[3]/div[1]/div[3]/button');

    await scrohla.type(result.name,"(//input[@name='name'])[1]");
    await scrohla.type(result.phoneNumber,"(//input[@name='phoneNumber'])[1]");
    await scrohla.type(result.email,"(//input[@name='emailAddress'])[1]");

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

    await sendResult({
        generatedData : result
    });

}

exports.target = target;




