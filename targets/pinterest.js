"use strict";

const { FileUtils } = require("../src/fileUtils");
const path = require("path");

const IMAGES_DEST = "/home/emerson/Downloads/";
const SCROLL_AMOUNT = 1;
const SCROLL_TIME = 3; // segundos

const target = {
    url : "https://www.pinterest.com/explore/famous-faces/",
    execute : init
};

let scrohla;
let result = {};

function init(_scrohla, sendResult){
    scrohla = _scrohla;
    scrohla.start();
    scroll();
    collectImages();
    scrohla.logInfo("Aguardando processo de gravação das imagens terminar ...");
    scrohla.flow( () => sendResult(result) );
}    

function scroll(){
    for (let index = 0; index < SCROLL_AMOUNT; index++) {
        scrohla.logInfo(`Scroll ${index + 1} ...`);
        scrohla.scrollToPageBottom();
        scrohla.sleep(SCROLL_TIME * 1000);
    }
}

function collectImages(){
    scrohla.findElements("//*[@class='Grid__Item']//img").then(elements => {
        result.quatidadeImagens = elements.length;
        scrohla.logInfo(`Coletando ${result.quatidadeImagens} imagens ...`);
        scrohla.sleep(2000);
        for (const element of elements){
            element.getAttribute("src").then( url => {
                FileUtils.download(url, IMAGES_DEST);
                scrohla.logInfo(path.basename(url));
            });
        }
    });
}

exports.target = target;