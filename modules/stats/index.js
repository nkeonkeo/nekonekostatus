"use strict";
const fetch=require("node-fetch"),
    schedule=require("node-schedule");
function sleep(ms){return new Promise(resolve=>setTimeout(()=>resolve(),ms));};
module.exports=async(svr)=>{
const {db,pr}=svr.locals;
var stats={},fails={};
svr.get("/",(req,res)=>{
    res.render('stats',{
        stats,
        admin:req.admin
    });
});
svr.get("/stats/data",(req,res)=>{res.json(stats);});
svr.get("/stats/:sid",(req,res)=>{
    var {sid}=req.params,node=stats[sid];
    res.render('stat',{
        sid,node,
        traffic:db.traffic.get(sid),
        load_m:db.load_m.select(sid),
        load_h:db.load_h.select(sid),
        admin:req.admin
    });
});
svr.get("/stats/:sid/data",(req,res)=>{
    var {sid}=req.params;
    res.json({sid,...stats[sid]});
});
svr.post("/stats/update",(req,res)=>{
    var {sid,data}=req.body;
    stats[sid]=data;
    res.json(pr(1,'update success'));
});
async function getStat(server){
    try{
        var res=await fetch(`http://${server.data.ssh.host}:${server.data.api.port}/stat`,{
            method:"GET",headers:{key:server.data.api.key},
        }).then(res=>res.json());
    }catch(e){
        // console.log(e);
        res={success:false,msg:'timeout'};
    }
    if(res.success)return res.data;
    else return false;
}
async function update(server){
    var {sid}=server,stat=-1;
    if(server.status==1)stat=await getStat(server);
    if(stat==-1){
        fails[sid]=(fails[sid]||0)+1;
        if(fails[sid]>3)delete stats[sid];
        return;
    }
    fails[sid]=0;
    if(server.data.device&&stat){
        var device=stat.net.devices[server.data.device];
        if(device){
            stat.net.total=device.total;
            stat.net.delta=device.delta;
        }
    }
    stats[sid]={name:server.name,stat};
}
async function get(){
    var s=new Set();
    for(var server of db.servers.all())
        if(server.status==1){
            update(server),s.add(server.sid);
            await sleep(300);
        }    
    for(var [sid,stat] of Object.entries(stats)){
        delete stats[sid];
        if(s.has(sid))stats[sid]=stat;
    }
}
function calc(){
    for(var server of db.servers.all()){
        var {sid}=server,stat=stats[sid];
        if(!stat||!stat.stat||stat.stat==-1)continue;
        var ni=stat.stat.net.total.in,
            no=stat.stat.net.total.out,
            t=db.lt.get(sid)||db.lt.ins(sid);
        var ti=ni<t.traffic[0]?ni:ni-t.traffic[0],
            to=no<t.traffic[1]?no:no-t.traffic[1];
        db.lt.set(sid,[ni,no]);
        db.traffic.add(sid,[ti,to]);
    }
}
get();
setInterval(get,3000);
sleep(10000).then(calc);
setInterval(calc,60*1000);

schedule.scheduleJob({second:0},()=>{
    for(var {sid} of db.servers.all()){
        var cpu=-1,mem=-1,swap=-1,ibw=-1,obw=-1;
        var stat=stats[sid];
        if(stat&&stat.stat&&stat.stat!=-1){
            cpu=stat.stat.cpu.multi*100;
            mem=stat.stat.mem.virtual.usedPercent;
            swap=stat.stat.mem.swap.usedPercent;
            ibw=stat.stat.net.delta.in;
            obw=stat.stat.net.delta.out;
        }
        db.load_m.shift(sid,{cpu,mem,swap,ibw,obw});
    }
});
schedule.scheduleJob({minute:0,second:1},()=>{
    db.traffic.shift_hs();
    for(var {sid} of db.servers.all()){
        var Cpu=0,Mem=0,Swap=0,Ibw=0,Obw=0,tot=0;
        for(var {cpu,mem,swap,ibw,obw} of db.load_m.select(sid))if(cpu!=-1){
            ++tot;
            Cpu+=cpu,Mem+=mem,Swap+=swap,Ibw+=ibw,Obw+=obw;
        }
        if(tot==0)db.load_h.shift(sid,{cpu:-1,mem:-1,swap:-1,ibw:-1,obw:-1});
        else db.load_h.shift(sid,{cpu:Cpu/tot,mem:Mem/tot,swap:Swap/tot,ibw:Ibw/tot,obw:Obw/tot});
    }
});
schedule.scheduleJob({hour:4,minute:0,second:2},()=>{db.traffic.shift_ds();});
schedule.scheduleJob({date:1,hour:4,minute:0,second:3},()=>{db.traffic.shift_ms();});
}
