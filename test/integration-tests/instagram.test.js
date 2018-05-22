"user strict";

const index = require("../../index");
const { expect } = require("chai");

let result;

describe("should validate result collect", () => {

    before((done) => {
        index.init("instagram/validator", "https://www.instagram.com/mario/", (_result) => {
            result = _result;
            done();
        });
    });
    
    it("should return not null object", (done) => {
        expect(result).to.be.an("object");
        expect(result).not.null;
        done();
    });

    it("should validate result", (done) => {
        expect(result.username).equal("mario");
        expect(result.name).equal("Mario Gomez");
        done();
    });

});


describe("should validate result collect", () => {

    before((done) => {
        index.init("instagram/validator", "https://www.instagram.com/flamengo/", (_result) => {
            result = _result;
            done();
        });
    });
    
    it("should return not null object", (done) => {
        expect(result).to.be.an("object");
        expect(result).not.null;
        done();
    });

    it("should validate result", (done) => {
        expect(result.username).equal("flamengo");
        expect(result.name).equal("Flamengo");
        done();
    });

});

describe("should validate result collect", () => {

    before((done) => {
        index.init("instagram/validator", "https://www.instagram.com/heman/", (_result) => {
            result = _result;
            done();
        });
    });
    
    it("should return not null object", (done) => {
        expect(result).to.be.an("object");
        expect(result).not.null;
        done();
    });

    it("should validate result", (done) => {
        expect(result.username).equal("heman");
        expect(result.name).equal("HeMan");
        done();
    });

});
