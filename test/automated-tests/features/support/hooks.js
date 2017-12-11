const { defineSupportCode } = require("cucumber");
const logger = require("winston");

defineSupportCode(function({ After, Before, AfterAll, BeforeAll, setDefaultTimeout }) {

    setDefaultTimeout(60 * 1000);

    BeforeAll(function() {
        logger.info("BeforeAll");
    });

    AfterAll(function() {
        logger.info("AfterAll");
    });

    Before(function() {
        logger.info("Before");
    });

    After(function() {
        logger.info("After");
        return this.scrohla.quit();
    });

});