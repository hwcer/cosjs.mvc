"use strict";

const loader = require("cosjs.loader")(null,1);
const library = require("cosjs.library");

module.exports = function(name,data,initialize){
    let config = loader.require(name);
    if(arguments.length==1){
        return config;
    }
    data = data || {};
    return library('format',data,config,initialize);
};


module.exports.loader = loader;