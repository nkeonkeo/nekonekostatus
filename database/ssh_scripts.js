"use strict"
module.exports=(DB)=>{
// DB.prepare("DROP TABLE ssh_scripts").run();
DB.prepare("CREATE TABLE IF NOT EXISTS ssh_scripts (id,name,content,PRIMARY KEY(id))").run();
const ssh_scripts={
    ins(id,name,content){this._ins.run({id,name,content})},_ins: DB.prepare("INSERT INTO ssh_scripts (id,name,content) VALUES (@id,@name,@content)"),
    get(id){return this._get.get(id);},_get:DB.prepare("SELECT * FROM ssh_scripts WHERE id=? LIMIT 1"),
    upd(id,name,content){this._upd.run(name,content,id);},_upd:DB.prepare("UPDATE ssh_scripts set name=?,content=? WHERE id=?"),
    del(id){this._del.run(id)},_del:DB.prepare("DELETE FROM ssh_scripts WHERE id=?"),
    all(all=1){return all?this._all.all():this._all.get()},_all:DB.prepare("SELECT * FROM ssh_scripts"),
};
return {
    ssh_scripts
};
}