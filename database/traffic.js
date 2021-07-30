"use strict"
module.exports=(DB)=>{
function shift(a){a.shift();a.push([0,0]);return a;}
// DB.prepare("DROP TABLE traffic").run();
DB.prepare("CREATE TABLE IF NOT EXISTS traffic (sid,hs,ds,ms,PRIMARY KEY(sid))").run();
const traffic={
    _ins: DB.prepare("INSERT INTO traffic (sid,hs,ds,ms) VALUES (@sid,@hs,@ds,@ms)"),
    ins(sid){
        this._ins.run({
            sid,
            hs:JSON.stringify(new Array(24).fill([0,0])),
            ds:JSON.stringify(new Array(31).fill([0,0])),
            ms:JSON.stringify(new Array(12).fill([0,0]))
        })
    },
    qry(sid){return this._qry.get(sid)},_qry: DB.prepare("SELECT * FROM traffic WHERE sid=?"),
    get(sid){
        var t=this._get.get(sid);
        if(t)return {hs:JSON.parse(t.hs),ds:JSON.parse(t.ds),ms:JSON.parse(t.ms),}
        this.ins(sid);
        return {
            hs:new Array(24).fill([0,0]),
            ds:new Array(31).fill([0,0]),
            ms:new Array(12).fill([0,0])
        };
    },_get:DB.prepare("SELECT hs,ds,ms FROM traffic WHERE sid=?"),
    UPD(sid,hs,ds,ms){this._UPD.run(JSON.stringify(hs),JSON.stringify(ds),JSON.stringify(ms),sid)},_UPD:DB.prepare("UPDATE traffic SET hs=?,ds=?,ms=? WHERE sid=?"),
    upd_sid(sid,newsid){DB.prepare("UPDATE traffic SET sid=? WHERE sid=?").run(newsid,sid)},

    get_hs(sid){return JSON.parse(this._hs.get(sid).hs)},_hs:DB.prepare("SELECT hs FROM traffic WHERE sid=?"),    
    upd_hs(sid,hs){this._UpdHs.run(JSON.stringify(hs),sid)},_UpdHs:DB.prepare("UPDATE traffic SET hs=? WHERE sid=?"),    

    get_ds(sid){return JSON.parse(this._hs.get(sid).ds)},_ds:DB.prepare("SELECT ds FROM traffic WHERE sid=?"),
    upd_ds(sid,ds){this._UpdDs.run(JSON.stringify(ds),sid)},_UpdDs:DB.prepare("UPDATE traffic SET ds=? WHERE sid=?"),

    get_ms(sid){return JSON.parse(this._ms.get(sid).ms)},_ms:DB.prepare("SELECT ms FROM traffic WHERE sid=?"),
    upd_ms(sid,ms){this._UpdMs.run(JSON.stringify(ms),sid)},_UpdMs:DB.prepare("UPDATE traffic SET ms=? WHERE sid=?"),

    del(sid){DB.prepare("DELETE FROM traffic WHERE sid=?").run(sid)},
    all(){return this._all.all()},itr(){return this._all.iterate()},_all:DB.prepare("SELECT * FROM traffic"),

    add(sid,tf){
        var {hs,ds,ms}=this.get(sid);
        hs[23][0]+=tf[0],ds[30][0]+=tf[0],ms[11][0]+=tf[0];
        hs[23][1]+=tf[1],ds[30][1]+=tf[1],ms[11][1]+=tf[1];
        this.UPD(sid,hs,ds,ms);
    },
    shift_hs(){
        for(var {sid,hs} of this.all())
            this.upd_hs(sid,shift(JSON.parse(hs)));
    },
    shift_ds(){
        for(var {sid,ds} of this.all())
            this.upd_ds(sid,shift(JSON.parse(ds)));
    },
    shift_ms(){
        for(var {sid,ms} of this.all())
            this.upd_ms(sid,shift(JSON.parse(ms)));
    }
}
// DB.prepare("DROP TABLE lt").run();
DB.prepare(`CREATE TABLE IF NOT EXISTS lt (sid,traffic,PRIMARY KEY(sid))`).run();
const lt={
    ins(sid,traffic=[0,0]){
        this._ins.run(sid,JSON.stringify(traffic));
        return {sid,traffic};
    },_ins:DB.prepare(`INSERT INTO lt (sid,traffic) VALUES (?,?)`),
    get(sid){
        var x=this._get.get(sid);
        if(x)x.traffic=JSON.parse(x.traffic);
        return x;
    },_get:DB.prepare(`SELECT * FROM lt WHERE sid=?`),
    set(sid,traffic){return this._set.run(JSON.stringify(traffic),sid);},_set:DB.prepare(`UPDATE lt SET traffic=? WHERE sid=?`),
    del(sid){this._del.run(sid);},_del:DB.prepare(`DELETE FROM lt WHERE sid=?`),
};
return {traffic,lt};
}