"use strict";

const { FileUtils } = require("../src/fileUtils");
const path = require("path");

const IMAGES_DEST = "/home/emerson/Downloads/schrola-pinterest-images";
const SCROLL_AMOUNT = 1;
const SCROLL_TIME = 3; // segundos

const target = {
    url: "https://www.pinterest.com/explore/famous-faces/",
    execute: init
};

let scrohla;
let result = {};

async function init(_scrohla, sendResult) {
    scrohla = _scrohla;
    await scrohla.start();
    await scroll();
    await collectImages();
    await scrohla.logInfo("Aguardando processo de gravação das imagens terminar ...");
    sendResult(result);
}

async function scroll() {
    for (let index = 0; index < SCROLL_AMOUNT; index++) {
        await scrohla.logInfo(`Scroll ${index + 1} ...`);
        await scrohla.scrollToPageBottom();
        await scrohla.sleep(SCROLL_TIME * 1000);
    }
}

async function collectImages() {
    const elements = await scrohla.findElements("//*[@class='Grid__Item']//img");
    result.quatidadeImagens = elements.length;
    await scrohla.logInfo(`Coletando ${result.quatidadeImagens} imagens ...`);
    await scrohla.sleep(2000);
    for (const element of elements) {
        const url = await element.getAttribute("src");
        await FileUtils.download(url, IMAGES_DEST);
        await scrohla.logInfo(path.basename(url));
    }
}

exports.target = target;
