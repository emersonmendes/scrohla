const { setWorldConstructor } = require("cucumber");
const { Scrohla } = require("../../../../src/scrohla");


class ScrohlaWorld {

  constructor() {
    this.scrohla = new Scrohla({});
  }

}

setWorldConstructor(ScrohlaWorld);