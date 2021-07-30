"use strict"
const express=require('express'),
    bp=require('body-parser'),
    ckp=require("cookie-parser"),
    nunjucks=require("nunjucks"),
    fs=require("fs");
const core=require("./core"),
    // schedule=require("./schedule"),
    db=require("./database")({cache:true}),
    {pr,md5,uuid}=core;
var config=require('./config');

var svr=express();

svr.use(bp.urlencoded({extended: false}));
svr.use(bp.json({limit:'100mb'}));
svr.use(ckp());
svr.use(express.json());
svr.use(express.static("./static"));

svr.engine('html', nunjucks.render);
svr.set('view engine', 'html');

var env=nunjucks.configure('views', {
    autoescape: true,
    express: svr,
    watch:config.noCache,
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
    if(password==md5(config.admin.password)){
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
})

svr.config=config;
svr.locals={
    config,
    db,
    ...core,
};

fs.readdirSync(__dirname+'/modules',{withFileTypes:1}).forEach(file=>{
    if(!file.isDirectory())return;
    try{require(`./modules/${file.name}/index.js`)(svr);}catch(e){console.log(e)}
});
schedules();
const port=process.env.PORT||config.port,host=process.env.HOST||'';
svr.server=svr.listen(port,host,()=>{
    console.log(`server running @ http://${host ? host : 'localhost'}:${port}`);
});

function schedules(){
    schedule.scheduleJob({minute:0,second:0},()=>{db.traffic.shift_hs();db.server_traffic.shift_hs();});
    schedule.scheduleJob({hour:4,minute:0,second:3},()=>{db.traffic.shift_ds();db.server_traffic.shift_ds();});
    schedule.scheduleJob({date:1,hour:4,minute:0,second:4},()=>{db.traffic.shift_ms();db.server_traffic.shift_ms();});
}