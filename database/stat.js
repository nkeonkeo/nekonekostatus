"use strict"
module.exports=(DB)=>{
var nul={cpu:0,ram:0,ibw:0,obw:0};
function shift(a,sta){a.shift();a.push(sta);return a;}
DB.prepare("DROP TABLE stat").run();
DB.prepare("CREATE TABLE IF NOT EXISTS stat (sid,ms,PRIMARY KEY(sid))").run();
const stat={
    // _ins: DB.prepare("INSERT INTO stat (sid,ms) VALUES (@sid,@ms)"),
    // ins(sid){
    //     this._ins.run({
    //         sid,
    //         hs:JSON.stringify(new Array(24).fill(nul)),
    //         ds:JSON.stringify(new Array(31).fill(nul)),
    //         ms:JSON.stringify(new Array(12).fill(nul))
    //     })
    // },
    // qry(sid){return this._qry.get(sid)},_qry: DB.prepare("SELECT * FROM stat WHERE sid=?"),
    // get(sid){
    //     var t=this._get.get(sid);
    //     if(t)return {hs:JSON.parse(t.hs),ds:JSON.parse(t.ds),ms:JSON.parse(t.ms),}
    //     this.ins(sid);
    //     return {
    //         hs:new Array(24).fill(nul),
    //         ds:new Array(31).fill(nul),
    //         ms:new Array(12).fill(nul)
    //     };
    // },_get:DB.prepare("SELECT hs,ds,ms FROM stat WHERE sid=?"),
    // UPD(sid,hs,ds,ms){this._UPD.run(JSON.stringify(hs),JSON.stringify(ds),JSON.stringify(ms),sid)},_UPD:DB.prepare("UPDATE stat SET hs=?,ds=?,ms=? WHERE sid=?"),
    // upd_sid(sid,newsid){DB.prepare("UPDATE stat SET sid=? WHERE sid=?").run(newsid,sid)},

    // get_hs(sid){return JSON.parse(this._hs.get(sid).hs)},_hs:DB.prepare("SELECT hs FROM stat WHERE sid=?"),    
    // upd_hs(sid,hs){this._UpdHs.run(JSON.stringify(hs),sid)},_UpdHs:DB.prepare("UPDATE stat SET hs=? WHERE sid=?"),    

    // get_ds(sid){return JSON.parse(this._hs.get(sid).ds)},_ds:DB.prepare("SELECT ds FROM stat WHERE sid=?"),
    // upd_ds(sid,ds){this._UpdDs.run(JSON.stringify(ds),sid)},_UpdDs:DB.prepare("UPDATE stat SET ds=? WHERE sid=?"),

    // get_ms(sid){return JSON.parse(this._ms.get(sid).ms)},_ms:DB.prepare("SELECT ms FROM stat WHERE sid=?"),
    // upd_ms(sid,ms){this._UpdMs.run(JSON.stringify(ms),sid)},_UpdMs:DB.prepare("UPDATE stat SET ms=? WHERE sid=?"),

    // del(sid){DB.prepare("DELETE FROM stat WHERE sid=?").run(sid)},
    // all(){return this._all.all()},itr(){return this._all.iterate()},_all:DB.prepare("SELECT * FROM stat"),

    // push_hs(sid,sta){
    //     this.upd_hs(sid,);
    // },
    // shift_hs(){
    //     for(var {sid,hs} of this.all())
    //         this.upd_hs(sid,shift(JSON.parse(hs)));
    // },
    // shift_ds(){
    //     for(var {sid,ds} of this.all())
    //         this.upd_ds(sid,shift(JSON.parse(ds)));
    // },
    // shift_ms(){
    //     for(var {sid,ms} of this.all())
    //         this.upd_ms(sid,shift(JSON.parse(ms)));
    // }
}
return {stat};
}