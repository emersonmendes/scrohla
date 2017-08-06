'use strict';

const firebase = require("firebase");
const config = require('./../config-db.json'); 

exports.DataBase = class {

  constructor(){
    firebase.initializeApp(config);
    this.database = firebase.database();
  }

  save(path, data, cb){
    this.database.ref(path).push(data,(error) => {
      cb && cb(error);
    });
  }

  get(path, cb){
    this.database.ref(path).on("child_added", (result) => {
      cb(result.val());
    });
  }

  remove(path,cb){
    this.database.ref(path).remove((error) => {
      cb && cb(error);
    });
  }

}
