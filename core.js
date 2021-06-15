"use strict";
function pr(status,data){return {status,data}};
function strB(b){
    var base=1024;
    if(b<base)return b.toString()+'B';
    if(b<base*base)return (b/base).toFixed(2)+'KB';
    if(b<base*base*base)return (b/base/base).toFixed(2)+'MB';
    if(b<base*base*base*base)return (b/base/base/base).toFixed(2)+'GB';
    else return (b/base/base/base/base).toFixed(2)+'TB';
}
function parseNumber(data){
    for(var key in data)if(data[key]){
        if(typeof data[key]=='object')data[key]=parseNumber(data[key]);
        else{
            var num=Number(data[key]);
            if(num||num==0)data[key]=num;
        }
    }
    return data;
}
module.exports={
    pr,strB,parseNumber,
    uuid:require("uuid"),md5:require("md5"),
    turnDate(date){return new Date(date).toLocaleString()},
}