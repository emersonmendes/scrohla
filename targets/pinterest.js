"use strict";

//const logger = require("winston");
//const credentials = require("./credentials.json").pinterest;

const target = {
    url : "https://www.pinterest.com/explore/famous-faces/",
    execute : collect
};

function collect(scrohla, sendResult){
    
    let result = { msg : "Downloads ok!" };
    
    // scrohla.click("//article//header//*[contains(@href,'followers')]");
    
    // scrohla.authenticate({
    //     loginURL: target.url,
    //     user :{ 
    //         xpath : "(//input[ @name='username' ])[1]", 
    //         data : credentials.user
    //     },
    //     pass : { 
    //         xpath : "(//input[@type='password'])[1]", 
    //         data : credentials.pass
    //     }
    // });

    scrohla.start();

    for (var index = 0; index < 2; index++) {
         scrohla.executeJs("window.scrollTo(0,document.body.scrollHeight);", "");
         scrohla.sleep(5000);
    }

    scrohla.findElements("//img").then(elements => {
        console.log(" Total: s%", elements.length);
        elements.forEach(element => {
            element.getAttribute("src").then( atrib => {
                console.log(atrib);
                require("child_process").exec(`wget ${atrib} --directory-prefix=/home/emerson/Downloads/`);
            });
        });
    });

    scrohla.flow( () => sendResult(result) );

    scrohla.quit();

}    

exports.target = target;