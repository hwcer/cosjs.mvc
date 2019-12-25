"use strict";

const cosjs_loader = require("cosjs.loader");
const cosjs_library = require("cosjs.library");
const configOptionCache = cosjs_library("dataset",{ "debug" : 0});
const configSearchCache = {};


function get_file_config(loader,name,key){
    let data = loader.require(name);
    if(!data){
        return null;
    }
    if(!Object.isFrozen(data)){
        Object.freeze(data);
    }
    if( arguments.length>2 && key !== null ){
        return data[key] || null;
    }
    else{
        return data;
    }
}

module.exports = cosjs_loader.bind(get_file_config);

module.exports.get = function(){
    return configOptionCache.get(...arguments);
}

module.exports.set = function(){
    return configOptionCache.set(...arguments);
}

module.exports.push = function(){
    return configOptionCache.push(...arguments);
}

module.exports.assign = function(){
    return configOptionCache.assign(...arguments);
}

module.exports.search = function(name,key,val){
    let sk = [name,key].join('-');
    if( configSearchCache[sk] ){
        return configSearchCache[sk][val] || [];
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
        configSearchCache[sk][v].push(obj);
    }
    return configSearchCache[sk][val] || null;
}
