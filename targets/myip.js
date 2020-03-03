"use strict";

 const collect = async function(scrohla, sendResult) {

    scrohla.start();

    const result = {
        ip: await scrohla.getText("(//*[@id='content']//table//tr[1]//td[2])[1]"),
        browser: await scrohla.getText("(//*[@id='content']//table//tr[3]//td[2])[1]"),
        platform: await scrohla.getText("(//*[@id='content']//table//tr[4]//td[2])[1]"),
        country: await scrohla.getText("(//*[@id='content']//table//tr[6]/td[2])[1]")
    };

    scrohla.takeScreenshot();

    sendResult(result);

}

exports.target = {
    url: "https://whatismyip.com.br/",
    execute: collect
};
