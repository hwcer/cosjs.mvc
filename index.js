"use strict";

const keys = ["model","config","format","library"];
const _plugs_modules = {};
for(let k of keys){
    let v = require("./lib/"+k);
    Object.defineProperty(exports,k, { value : v,  writable : false, enumerable : true, configurable : false });
}

//附加模块
function plugs (path){
    let opt = require(path);
    if(!opt || !opt['root'] || !opt['modules'] || !opt['namespace'] ){
        return;
    }

    if(Array.isArray(opt['dependencies'])){
        for(let d of opt['dependencies']){
            if(!_plugs_modules[d]){
                throw new Error(`plugs[${opt['namespace']}] dependencies ${d} not exist`)
            }
        }
    }

    let namespace = opt['namespace'];
    _plugs_modules[namespace] = opt;

    for(let k of opt['modules']){
        if(keys.indexOf(k) >=0){
            let loader = exports[k].loader;
            append_loader_files(loader,opt['modules'][k],namespace,opt['root']);
        }
    }
}

plugs.append = function(loader,key){
    for(let name in _plugs_modules){
        let opt = _plugs_modules[name];
        if(opt['modules'][key]){
            append_loader_files(loader,opt['modules'][key],opt['namespace'],opt['root']);
        }
    }
}

function append_loader_files(loader,path,namespace,root) {
    if(Array.isArray(path)){
        for(let p of path){
            loader.addFile(root +'/'+ p,namespace)
        }
    }
    else{
        loader.addPath(root +'/'+ path,namespace)
    }
}


Object.defineProperty(exports,'plugs', { value : plugs,  writable : false, enumerable : true, configurable : false });





