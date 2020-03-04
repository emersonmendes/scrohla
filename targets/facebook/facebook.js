"use strict";

const target = {
    url: "https://www.facebook.com/pg/FlamengoOficial",
    loginURL: "https://www.facebook.com/",
    execute: collect
};

function collect(scrohla, sendResult) {

    let result = {};

    scrohla.authenticate({
        loginURL: target.loginURL,
        credentialsName: 'facebook',
        user: {
            xpath: "(//input[ @type='email' ])[1]"
        },
        pass: {
            xpath: "(//input[@type='password'])[1]"
        },
        cookies: true
    });

    scrohla.start();

    scrohla.waitForLocated("//*[@data-click='profile_icon']");

    scrohla.getText("//h1[@id='seo_h1_tag']").then(text => {
        result.fullName = text;
    });

    scrohla.getText("//h1[@id='seo_h1_tag']").then(text => {
        result.fullName = text;
    });

    scrohla.flow(() => sendResult(result));

}

exports.target = target;
