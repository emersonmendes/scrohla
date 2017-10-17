'use strict';

const logger = require('winston');
const tesseract = require("tesseract.js");
const sharp = require("sharp");

const target = {
    url : "http://ceat.trt15.jus.br/ceat/",
    execute : collect
};

function toText(scrohla, data, callback){
    scrohla.flow( () => {
        
        const ocr =  tesseract.create({
            workerPath: "./node_modules/tesseract.js/src/node/worker.js",
            langPath:   __dirname.replace("targets","") + "tesseract-langs/" // langs -> https://github.com/naptha/tessdata
        });
        
        ocr.recognize(data).then(result => {
            callback(result.text);
        });

    });
}

function collect(scrohla, sendResult){

    let result = {};
    
    scrohla.start();
    
    scrohla.getAttrib('//*[@id="certidaoActionForm:j_id51"]/div/span[1]/img',"src").then(img => {

        // lib temporaria, implementação temporaria
        require('image-downloader').image({
            url: img,
            dest: '/tmp' 
        }).then(({ filename, image }) => {
            sharp(filename)
                .resize(100)
                .toBuffer()
                .then( data => {
                    toText(scrohla, data, captchaText => {
                        console.log("captchaText: ", captchaText);
                        result.captchaText = captchaText;
                    });
                });
        }).catch((err) => {
            console.error(err);
            throw err;
        });

    });

    scrohla.flow( () => {
        sendResult(result);
    });

}

exports.target = target;