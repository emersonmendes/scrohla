const assert = require('assert');
const { DataBase } = require('../src/db');
const logger = require('winston');

const DOC = "/teste";

before((done) => {
  this.db = new DataBase();
  done();
});

after((done) => {
  this.db.remove(DOC,done);
});

describe('# Database', () => {
  
  it('should save without error', (done) => {
    this.db.save(DOC + "/person",{
      name: "Emerson",
      sureName: "Mendes"
    },done);
  });

});