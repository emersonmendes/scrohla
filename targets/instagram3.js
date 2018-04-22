/* global window, _sharedData, XMLHttpRequest */
"use strict";

const logger = require("../src/logger");
const credentials = require("./credentials.json").instagram;
const { FileUtils } = require("../src/fileUtils");

const target = {
    url : "https://www.instagram.com/jaysontreze/",
    loginURL : "https://www.instagram.com/accounts/login",
    execute : collect
};

let scrohla;
let result = {};

const followersUsername = [];

const tableLiXpath = "//*[@class='_p4iax']//li";

function populateUsernames(xpath, beforeSize){
    
    scrohla.click(xpath);
    scrohla.waitForLocated("//*[@class='_gs38e']");

    scrohla.flow(() => logger.info("Scrolling..."));
    scrohla.executeJs("document.querySelector('._gs38e').scrollBy(0,50000)");
    scrohla.sleep(500);
    scrohla.waitForLocated(tableLiXpath);
    scrohla.findElements(tableLiXpath).then( people => {
        
        logger.info("Pessoas encontradas: %s", people.length);
        logger.info("beforeSize: %s", beforeSize);

        if(people.length < result.amoutFollowers && people.length !== beforeSize){
            populateUsernames(tableLiXpath, people.length);
        } else {
            for( let person of people ){
                scrohla.findElement(person,".//*[@class='_2nunc']//a").then( personElement => {
                    personElement.getAttribute("title").then( user => followersUsername.push(user) );
                });
            }
        }

    });

}

function authenticate(){
    scrohla.authenticate({
        loginURL: target.loginURL,
        user :{ 
            xpath : "(//input[ @name='username' ])[1]", 
            data : credentials.user
        },
        pass : { 
            xpath : "(//input[@type='password'])[1]", 
            data : credentials.pass
        },
        cookies : true
    });
}

function collect(_scrohla, sendResult){

    scrohla = _scrohla;

    authenticate();
    scrohla.start();

    const followersXpath = "//a[@href='/jaysontreze/followers/']";

    scrohla.getText(followersXpath + "//span").then( r => result.amoutFollowers = Number(r) );

    populateUsernames(followersXpath, 0);

    scrohla.flow(() => {
        let content = "";
        for( let user of followersUsername){
            content = content.concat(user).concat(",");
        }
        content = content.substring( 0, content.length - 1)
        FileUtils.writeFile("./followers.txt", content, () => {
            sendResult(result);
        });
    });

}    

exports.target = target;