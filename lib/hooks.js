"use strict";
const loader = require("cosjs.loader")();


module.exports = function(name){
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


module.exports.loader = loader