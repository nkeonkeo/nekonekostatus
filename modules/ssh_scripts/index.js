"use strict";
const uuid=require("uuid");
module.exports=svr=>{
const {db,pr}=svr.locals;
var rt=require("express").Router();
rt.get("/admin/ssh_scripts",(req,res)=>{
    res.render("admin/ssh_scripts",{
        ssh_scripts:db.ssh_scripts.all(),
    });
});
rt.post("/admin/ssh_scripts/add",(req,res)=>{
    var {id=uuid.v1(),name,content}=req.body;
    db.ssh_scripts.ins(id,name,content);
    res.json(pr(true,id));
});
rt.post("/admin/ssh_scripts/get",(req,res)=>{
    var {id}=req.body;
    res.json(pr(true,db.ssh_scripts.get(id)));
});
rt.post("/admin/ssh_scripts/upd",(req,res)=>{
    var {id,name,content}=req.body;
    db.ssh_scripts.upd(id,name,content);
    res.json(pr(true,'修改成功'));
});
rt.post("/admin/ssh_scripts/del",(req,res)=>{
    var {id}=req.body;
    db.ssh_scripts.del(id);
    res.json(pr(true,'删除成功'));
});
svr.use(rt);
}