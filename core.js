"use strict";

const loader = require('cosjs.loader');

const mkeys = new Set(["handle","model","config","format","library"]);
const mroot = new Set();


Object.defineProperty(module.exports,'addPath', { value : add_mvc_path,  writable : false, enumerable : true, configurable : false });
//内置标准件
for(let k of mkeys){
    let v = require("./lib/"+k);
    Object.defineProperty(module.exports,k, { value : v,  writable : false, enumerable : true, configurable : false });
}



//添加新标准件,name,path,safe,ext
module.exports.adapter = function(name,...args){
    if(mkeys.has(name)){
        return Promise.reject(`mvc.adapter(${name}) exist`)
    }
    mkeys.add(name);
    Object.defineProperty(module.exports,name, { value : loader.package.apply(null,args),  writable : false, enumerable : true, configurable : false });
    //将所有路径加入到新标准件中
    return Promise.all([...mroot].map(function (root) {
        let p = [root,name].join('/');
        let d = module.exports[name]();
        return d.addPath(p);
    })).then(()=>module.exports[name]);
}


function add_mvc_path(root){
    if(mroot.has(mroot)){
        return ;
    }
    mroot.add(root);
    return Promise.all([...mkeys].map(function (k) {
        let p = [root,k].join('/');
        let loader = module.exports[k]();
        return loader.addPath(p);
    }))
}

