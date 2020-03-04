/* global window, _sharedData, XMLHttpRequest */
"use strict";

const logger = require("../../src/logger");
const { FileUtils } = require("../../src/fileUtils");

const target = {
    url: "https://www.instagram.com/mario/",
    loginURL: "https://www.instagram.com/accounts/login",
    execute: collect,
    custom: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50 Safari/537.36"
    }
};

function collect(scrohla, sendResult) {

    login(scrohla);

    scrohla.start();

    scrohla.sleep(5000);

    scrohla.flow(() => logger.info("Iniciando execução script.."));

    scrohla.executeJs(populatePosts).then(result => {

        logger.info(`Got ${result.totalFound} of ${result.totalPosts}`);

        if (result.totalFound < result.totalPosts) {
            scroll(scrohla);
        }

        getPosts(scrohla).then(posts => {

            const jsonResult = `/home/emerson/Downloads/result_${new Date().getTime()}.json`;

            scrohla.flow(() => FileUtils.writeFile(jsonResult, JSON.stringify(posts, null, 4)));

            scrohla.flow(() => sendResult({
                msg: "Coleta efetuada com sucesso.",
                json: jsonResult,
                totalFound: result.totalFound,
                totalPosts: result.totalPosts
            }));

        });

    });

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

function populatePosts() {

    var media = _sharedData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media;

    window.scrohla = {
        totalPosts: media.count,
        posts: media.edges
    };

    var origOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("load", function () {
            var response = JSON.parse(this.responseText);
            if (response.data) {
                window.scrohla.posts = window.scrohla.posts.concat(response.data.user.edge_owner_to_timeline_media.edges);
            }
        });
        origOpen.apply(this, arguments);
    };

    return {
        totalPosts: window.scrohla.totalPosts,
        totalFound: window.scrohla.posts.length
    };

}

function scroll(scrohla) {

    scrohla.sleep(1000);

    logger.info("Scrolling...");
    scrohla.executeJs(function () {
        window.scrollTo(0, 500000);
    });

    scrohla.executeJs(function () {
        return {
            totalPosts: window.scrohla.totalPosts,
            totalFound: window.scrohla.posts.length
        };
    }).then(result => {
        if (result.totalPosts > result.totalFound) {
            scroll(scrohla);
        }
        logger.info(`Got ${result.totalFound} of ${result.totalPosts}`);
    });

}

function getPosts(scrohla) {
    return scrohla.executeJs(function () {
        return window.scrohla.posts;
    });
}

exports.target = target;
