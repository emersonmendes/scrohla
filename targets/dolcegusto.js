"use strict";

const credentials = require("./credentials.json").dolcegusto;

const CODIGO = "7en6 n93t 99lj";

const target = {
  url : "https://www.nescafe-dolcegusto.com.br/mybonus/",
  execute : collect
};

function collect(scrohla, sendResult){

  let result = {};

  scrohla.authenticate({
    loginURL: target.url,
    user :{ 
        xpath : "//input[@id='email']", 
        data : credentials.user
    },
    pass : { 
        xpath : "//input[@id='pass']", 
        data : credentials.pass
    },
    beforeLogin : () => {
      scrohla.mouseMoveTo("//div[@id='header-account']");
    },
    cookies : false
  });

  scrohla.type(CODIGO.replace(/ /g,"").toUpperCase(),"//input[@id='coupon_code']");
  scrohla.click("//*[@id='pcm-codes-form']//button");

  scrohla.waitFor("//*[@class='error-msg']",5000)
    .then(()=>{
      result.erro = `Codigo ${CODIGO} está inválido ou já foi utilizado!`;
    })
    .catch(() => { 
      result.msg = `Codigo ${CODIGO} inserido com sucesso!`;
    });
 
  scrohla.flow( () => sendResult(result) );

  scrohla.quit();

}

exports.target = target;




