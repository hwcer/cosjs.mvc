"use strict";

const cosjs_loader = require("cosjs.loader");
const cosjs_library = require("cosjs.library");

module.exports = cosjs_loader.bind(get_file_format,null,1);

 function get_file_format(loader,name,data,initialize){
    let config;
    if(Array.isArray(name)){
        config = {};
        for(let f of name){
            let c = loader.parse(f);
            if(c) Object.assign(config,c);
        }
    }
    else{
        config = loader.parse(name);
    }
    if(arguments.length <= 2){
        return config;
    }
    data = data || {};
    return cosjs_library('format',data,config,initialize);
};

