"use strict";
const loader = require("cosjs.loader")();

function model (name){
    let fun = loader.parse(name);
    if(!fun){
        throw new Error(`model[${name}] not exist`);
    }
    if(typeof fun === 'function'){
        return fun.apply(this,Array.prototype.slice.call(arguments,1) );
    }
    else{
        return fun;
    }
}


module.exports = model;

module.exports.loader = loader;

module.exports.namespace = function(name){
    if(!name){
        throw new Error("namespace name empty");
    }
    if(module.exports[name]){
        return;
    }
    module.exports[name] = function(){
        arguments[0] = [name,arguments].join('/')
        return model.apply(this,arguments);
    }
}
