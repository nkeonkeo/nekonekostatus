"use strict";
const Database=require("better-sqlite3");
module.exports=(conf={})=>{
var {path=__dirname+'/db.db',cache}=conf;
var DB=new Database(path);

const {servers}=require("./servers")(DB);
const {setting}=require("./setting")(DB);
function getServers(){return servers.all();}
return {
    DB,
    servers,getServers,
    setting,
};
}