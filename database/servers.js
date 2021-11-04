"use strict"
module.exports=(DB)=>{
// // // DB.prepare("DROP TABLE servers").run();
DB.prepare("CREATE TABLE IF NOT EXISTS servers (sid,name,data,top,status,PRIMARY KEY(sid))").run();
const servers={
    _ins:DB.prepare("INSERT INTO servers (sid,name,data,top,status) VALUES (?,?,?,?,?)"),
    ins(sid,name,data,top,status=1){this._ins.run(sid,name,JSON.stringify(data),top,status)},
    _upd:DB.prepare("UPDATE servers SET name=?,data=?,top=? WHERE sid=?"),
    upd(sid,name,data,top){
        this._upd.run(name,JSON.stringify(data),top,sid);
    },
    upd_status(sid,status){DB.prepare("UPDATE servers SET status=? WHERE sid=?").run(status,sid);},
    upd_data(sid,data){DB.prepare("UPDATE servers SET data=? WHERE sid=?").run(JSON.stringify(data),sid);},
    upd_top(sid,top){
        this._upd_top.run(top,sid);
    },_upd_top:DB.prepare("UPDATE servers set top=? WHERE sid=?"),
    _get:DB.prepare("SELECT * FROM servers WHERE sid=?"),
    get(sid){
        var server=this._get.get(sid);
        if(server)server.data=JSON.parse(server.data);
        return server;
    },
    del(sid){DB.prepare("DELETE FROM servers WHERE sid=?").run(sid);},
    _all:DB.prepare("SELECT * FROM servers ORDER BY top DESC"),
    all(){
        var svrs=this._all.all();
        svrs.forEach(svr=>{svr.data=JSON.parse(svr.data);});
        return svrs;
    },
};
return {servers};
}