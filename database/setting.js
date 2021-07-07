
"use strict"
module.exports=(DB)=>{
// // // DB.prepare("DROP TABLE servers").run();
DB.prepare("CREATE TABLE IF NOT EXISTS setting (key,val,PRIMARY KEY(key))").run();
function S(val){return JSON.stringify(val);}
const setting={
    _ins:DB.prepare("INSERT INTO setting (key,val) VALUES (?,?)"),
    ins(key,val){this._ins.run(key,val)},
    _upd:DB.prepare("UPDATE setting SET val=? WHERE key=?"),
    upd(key,val){this._upd.run(S(val),key);},
    _get:DB.prepare("SELECT * FROM setting WHERE key=?"),
    get(key){return JSON.parse(this._get.get(key));},
    del(key){DB.prepare("DELETE FROM setting WHERE key=?").run(key);},
    _all:DB.prepare("SELECT * FROM setting"),
    all(){
        var s={};
        for({key,val} of this._all.all())s[key]=JSON.parse(val);
        return s;
    },
};
return {setting};
}