"use strict";
const loader = require("cosjs.loader")(null,1);
const configOptionCache = { "debug" : 0};
const configSearchCache = {};



function get_file_config(name,key,path){
    let data = loader.require(name);
    if(!data){
        return null;
    }
    if(!Object.isFrozen(data)){
        Object.freeze(data);
    }
    if( arguments.length>1 && key !== null ){
        return data[key] || null;
    }
    else{
        return data;
    }
}

module.exports = get_file_config;

module.exports.get = function(key){
    return configOptionCache[key]||null;
}

module.exports.set = function(key,val){
    if(typeof key ==="object"){
        Object.assign(configOptionCache,key)
    }
    else{
        configOptionCache[key] = val;
    }
}



module.exports.search = function(name,key,val){
    let sk = [name,key].join('-');
    if( configSearchCache[sk] ){
        return configSearchCache[sk][val] || null;
    }
    configSearchCache[sk] = {};
    let config = get_file_config(name);
    if(!config){
        return null;
    }
    for(let k in config){
        let obj = config[k];
        if( (!(key in obj )) || obj[key] === '' ){
            continue;
        }
        let v = obj[key];
        if(!configSearchCache[sk][v]){
            configSearchCache[sk][v] = [];
        }
        let id = parseInt(k);
        let index = id == k ? id :k;
        configSearchCache[sk][v].push(index);
    }
    return configSearchCache[sk][val] || null;
}


module.exports.loader = loader;