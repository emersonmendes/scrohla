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

const UNFOLLOW_DELAY = 30000;
const AMOUNT_TO_UNFOLLOW = 1000;

const followingUsernameMap = new Map();
const followersUsernameMap = new Map();

let scrohla;
let result = {};


function populateUsernames(xpath, beforeLength){
    
    scrohla.click(xpath);
    scrohla.waitForLocated("//*[@class='_gs38e']");
    
    scrohla.flow(() => logger.info("Scrolling..."));
    scrohla.executeJs("document.querySelector('._gs38e').scrollBy(0,50000)");
    scrohla.sleep(500);
    
    const tableRowXpath = "//*[@class='_p4iax']//li";
    scrohla.waitForLocated(tableRowXpath);
    scrohla.findElements(tableRowXpath).then( rows => {
        
        logger.info("Pessoas encontradas: %s", rows.length);

        if(rows.length < AMOUNT_TO_UNFOLLOW && rows.length !== beforeLength){
            populateUsernames(tableRowXpath, rows.length);
        } else {
            for( let row of rows ){
                scrohla.findElement(row,".//*[@class='_2nunc']//a").then( person => {
                    person.getAttribute("title").then( title => followingUsernameMap.set(title, row) );
                });
            }
        }

    });

}

function authenticate(){
    scrohla.authenticate({
        loginURL: target.loginURL,
        user : { xpath : "(//input[@name='username'])[1]", data : credentials.user },
        pass : { xpath : "(//input[@type='password'])[1]", data : credentials.pass },
        cookies : true
    });
}

function unfollow(u, index){
    scrohla.findElement(followingUsernameMap.get(u),".//button").then( button => {
        button.click().then( () => logger.info(`unfollowed ${index}: ${u} `) );
    });
}

function collect(_scrohla, sendResult){

    scrohla = _scrohla;

    scrohla.flow(() => {
        FileUtils.readFile("./followers.txt",(error, data) => {
            for (const value of data.split(",")) {
                followersUsernameMap.set(value);
            }
        });
    });

    authenticate();
    scrohla.start();

    const followingXpath = "//a[@href='/jaysontreze/following/']";

    scrohla.getText(followingXpath + "//span").then( r => result.amoutFollowing = Number(r.replace(",","")) );

    populateUsernames(followingXpath, 0);

    scrohla.flow( () => {
        logger.info(`unfolling ${followingUsernameMap.size} pessoas ...`);
        let index = 0;
        for(let key of followingUsernameMap.keys() ){
            if(!followersUsernameMap.has(key)){
                unfollow(key, ++index);
                scrohla.sleep(UNFOLLOW_DELAY);
            }
        }
    });

    scrohla.flow( () => sendResult(result) );

}    

exports.target = target;