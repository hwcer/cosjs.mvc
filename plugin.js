"use strict";
const FS  = require('fs');
const mvc = require('./core');

const _plugin_config = mvc.library("dataset");
const _plugin_module = mvc.library("dataset");

exports = module.exports = _plugin_config;
/*
  配置:root 默认路径
 */
exports.get = function () {
    return _plugin_module.get(...arguments);
}
exports.has = function () {
    return _plugin_module.has(...arguments);
}
//添加插件
exports.adapter = function () {
    if(Array.isArray(arguments[0])){
        return multi(arguments[0]);
    }
    else{
        return adapter(...arguments);
    }
}

//[[name,option],[name,option]]
function multi(pluginModule){
    let root = _plugin_config.get("root")
    let pluginTask = mvc.library("multi",pluginModule,arr=>{
        if(!Array.isArray(arr)){
            arr = [arr];
        }
        let path = arr[0].indexOf('/') >=0 ? arr[0] : [root,arr[0]].join('/');
        return adapter(path,arr[1]||{});
    })
    return pluginTask.start();
}

function adapter(path,options={}) {
    let func = require(path);
    if(typeof func !== 'function'){
        return Promise.reject(`plugin not exist:${path}`);
    }
    return Promise.resolve().then(()=>{
        return func(options);
    }).then(ret=>{
        let {name,config,plugin} = ret;
        if( !name || typeof config !== 'object' || typeof plugin !== 'object' ){
            return Promise.reject(`plugin error:${path}`);
        }

        if(_plugin_module.has(name)){
            return Promise.reject(`plugin[${name}] exist:${path}`);
        }
        _plugin_module.set(name,config);
        if(options) {
            _plugin_module.assign(name, options);
        }
        if(!plugin){
            return ;
        }
        let _plugin_key = Object.keys(plugin)
        return Promise.all(_plugin_key.map(key=>{
            return plugin_module_property(name,key,plugin[key]);
        }));
    })
}





function plugin_module_property(name,key,opts){
    if(!mvc[key]){
        return Promise.resolve(`${key} not exist at mvc` );
    }
    let M = mvc[key],P = opts;
    if(typeof P !== 'object'){
        return plugin_module_append.call(M(),P,name);
    }
    let arr = Object.keys(P);
    return Promise.all(arr.map(k=>{
        if(!M[k]){
            return Promise.resolve(`${k} not exist at mvc.${key}` );
        }
        else{
            let ns = M[k]();
            return  plugin_module_append.call(ns,P[k],name);
        }
    }));
}

function plugin_module_append(file,name){
    return mvc.library.call(FS, "promise",'stat',file).then((stats)=>{
        if(stats.isFile()){
            return this.addFile(file,name)
        }
        else if (stats.isDirectory()) {
            return this.addPath(file,name);
        }
        else{
            return mvc.library("promise/callback", "path error",file);
        }
    })
}