"use strict";

const keys = ["hooks","model","config","format"];


for(let k of keys){
    exports[k] = require("./lib/"+k);
}

exports.reload = function(){
    for(let k of keys){
        exports[k]["loader"].reload();
    }
}