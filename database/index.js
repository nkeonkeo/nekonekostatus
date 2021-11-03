"use strict";
const Database=require("better-sqlite3");
module.exports=(conf={})=>{
var {path=__dirname+'/db.db'}=conf;
var DB=new Database(path);

const {servers}=require("./servers")(DB),
    {traffic,lt}=require("./traffic")(DB),
    {load_m,load_h}=require("./load")(DB),
    {ssh_scripts}=require("./ssh_scripts")(DB),
    {setting}=require("./setting")(DB);
function getServers(){return servers.all();}
return {
    DB,
    servers,getServers,
    traffic,lt,
    load_m,load_h,
    ssh_scripts,
    setting,
};
}