/* global window, _sharedData, XMLHttpRequest */
"use strict";

const logger = require("../src/logger");
const credentials = require("./credentials.json").instagram;
const { FileUtils } = require("../src/fileUtils");

const target = {
    url : "https://www.instagram.com/mario/",
    loginURL : "https://www.instagram.com/accounts/login",
    execute : collect
};

function populatePosts (){

    const media = _sharedData.entry_data.ProfilePage[0].user.media;

    window.scrohla = { totalPosts : media.count, posts : [] };

    media.nodes.forEach( item => window.scrohla.posts.push({ node : item }) );
    
    var origOpen = XMLHttpRequest.prototype.open;
        
    XMLHttpRequest.prototype.open = function() {
    
        this.addEventListener("load", function() {
            const response = JSON.parse(this.responseText);
            if(response.data){
                window.scrohla.posts = window.scrohla.posts.concat(response.data.user.edge_owner_to_timeline_media.edges);
            }
        });

        origOpen.apply(this, arguments);

    };

    return {
        totalPosts : window.scrohla.totalPosts,
        totalFound : window.scrohla.posts.length
    };

}

function scroll(scrohla){
    
    logger.info("Scrolling...");
    scrohla.executeJs(function(){
        window.scrollTo(0, 500000);
    });

    scrohla.sleep(5000);
    
    scrohla.executeJs(function(){
        return { 
            totalPosts : window.scrohla.totalPosts, 
            totalFound : window.scrohla.posts.length 
        };
    }).then(result => {
        if(result.totalPosts > result.totalFound){
            scroll(scrohla);
        }
        logger.info(`Got ${result.totalFound} of ${result.totalPosts}`);
    });

}

function getPosts(scrohla){
    return scrohla.executeJs(function(){
        return window.scrohla.posts;
    });
}

function collect(scrohla, sendResult){

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

    scrohla.start();

    scrohla.sleep(5000);

    scrohla.flow( () => logger.info("Iniciando execução script..") );

    scrohla.executeJs(populatePosts).then( result => {
        
        logger.info(`Got ${result.totalFound} of ${result.totalPosts}`);
        
        if(result.totalFound < result.totalPosts ){
            scroll(scrohla);
        }
        
        getPosts(scrohla).then(posts => { 

            const jsonResult = `/home/emerson/Downloads/result_${new Date().getTime()}.json`;
            
            scrohla.flow( () => FileUtils.writeFile(jsonResult, JSON.stringify(posts, null, 4)));

            const imagesPath = "/home/emerson/Downloads/images/";

            for(let post of posts){
                FileUtils.download((post.node.display_url || post.node.display_src), imagesPath);
            }
            
            scrohla.sleep(posts.length * 0.5);

            scrohla.flow( () => sendResult({
                msg: "Coleta efetuada com sucesso.",
                json : jsonResult,
                images : imagesPath,
                totalFound : result.totalFound,
                totalPosts : result.totalPosts
            }) );

        });

    });   

}    

exports.target = target;