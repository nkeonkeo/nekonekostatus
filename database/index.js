"use strict";
const Database=require("better-sqlite3");
module.exports=(setting={})=>{
var {path=__dirname+'/db.db',cache}=setting;
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