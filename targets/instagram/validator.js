"use strict";

const result = {};

const target = {
    loginURL: "https://www.instagram.com/accounts/login",
    execute: collect,
    custom: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50 Safari/537.36"
    }
};

function collect(scrohla, sendResult) {

    login(scrohla);

    scrohla.start();

    scrohla.sleep(1000);

    scrohla.getText("//*[@id='react-root']/section/main/div/header/section/div[2]/h1").then(text => result.name = text);
    scrohla.getText("//*[@id='react-root']/section/main/div/header/section/div[1]/h1").then(text => result.username = text);

    scrohla.flow(() => sendResult(result));

}

function beforeLogin(scrohla) {
    scrohla.sleep(3000);
    scrohla.takeScreenshot();
}

function login(scrohla) {
    scrohla.authenticate({
        loginURL: target.loginURL,
        credentialsName: 'instagram',
        user: { xpath: "(//input[@name='username'])[1]" },
        pass: { xpath: "(//input[@type='password'])[1]" },
        cookies: true,
        beforeLogin: () => beforeLogin(scrohla)
    });
}

exports.target = target;
