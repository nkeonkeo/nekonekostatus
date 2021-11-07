#!/usr/bin/env node
"use strict"
const express=require('express'),
    bp=require('body-parser'),
    ckp=require("cookie-parser"),
    nunjucks=require("nunjucks"),
    fs=require("fs"),
    schedule=require("node-schedule");
const core=require("./core"),
    db=require("./database")(),
    {pr,md5,uuid}=core;
var setting=db.setting.all();
var svr=express();

svr.use(bp.urlencoded({extended: false}));
svr.use(bp.json({limit:'100mb'}));
svr.use(ckp());
svr.use(express.json());
svr.use(express.static(__dirname+"/static"));

svr.engine('html', nunjucks.render);
svr.set('view engine', 'html');
require('express-ws')(svr);

var env=nunjucks.configure(__dirname+'/views', {
    autoescape: true,
    express: svr,
    watch:setting.debug,
});
var admin_tokens=new Set();
try{for(var token of require("./tokens.json"))admin_tokens.add(token);}catch{}
setInterval(()=>{
    var tokens=[];
    for(var token of admin_tokens.keys())tokens.push(token);
    fs.writeFileSync(__dirname+"/tokens.json",JSON.stringify(tokens));
},1000);
svr.all('*',(req,res,nxt)=>{
    if(admin_tokens.has(req.cookies.token))req.admin=true;
    nxt();
});
svr.get('/login',(req,res)=>{
    if(req.admin)res.redirect('/');
    else res.render('login',{});
});
svr.post('/login',(req,res)=>{
    var {password}=req.body;
    if(password==md5(db.setting.get("password"))){
        var token=uuid.v4();
        admin_tokens.add(token);
        res.cookie("token",token);
        res.json(pr(1,token));
    }
    else res.json(pr(0,"密码错误"));
});
svr.get('/logout',(req,res)=>{
    admin_tokens.delete(req.cookies.token);
    res.clearCookie("token");
    res.redirect("/login");
});
svr.all('/admin*',(req,res,nxt)=>{
    if(req.admin)nxt();
    else res.redirect('/login');
});
svr.get('/admin/db',(req,res)=>{
    var path=__dirname+"/database/backup.db";
    db.DB.backup(path).then(()=>{res.sendFile(path)});
});

var bot=null;
if(setting.bot&&setting.bot.token){
    bot=require("./bot")(setting.bot.token,setting.bot.chatIds);
    if(setting.bot.webhook){
        bot.bot.setWebHook(setting.site.url+"/bot"+setting.bot.token).then(()=>{
            bot.bot.setMyCommands(bot.cmds);
        });
        svr.all('/bot'+setting.bot.token, (req,res)=>{
            bot.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
    }
    else bot.bot.startPolling();
}
svr.locals={
    setting,
    db,
    bot,
    ...core,
};

fs.readdirSync(__dirname+'/modules',{withFileTypes:1}).forEach(file=>{
    if(!file.isDirectory())return;
    try{require(`./modules/${file.name}/index.js`)(svr);}catch(e){console.log(e)}
});
const port=process.env.PORT||db.setting.get("listen"),host=process.env.HOST||'';
svr.server=svr.listen(port,host,()=>{console.log(`server running @ http://${host ? host : 'localhost'}:${port}`);})