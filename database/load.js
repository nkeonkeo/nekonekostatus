`use strict`
function pad(arr,len){
    for(var i=arr.length;i<len;++i)
        arr.unshift({cpu:0,mem:0,swap:0,ibw:0,obw:0});
    return arr;
}
module.exports=(DB)=>{
function gen(table,len){
// DB.prepare(`DROP TABLE ${table}`).run();
DB.prepare(`CREATE TABLE IF NOT EXISTS ${table} (sid,cpu,mem,swap,ibw,obw)`).run();
return {
    len,
    _ins: DB.prepare(`INSERT INTO ${table} (sid,cpu,mem,swap,ibw,obw) VALUES (@sid,@cpu,@mem,@swap,@ibw,@obw)`),
    ins(sid){this._ins.run({sid,cpu:0,mem:0,swap:0,ibw:0,obw:0})},
    select(sid){return pad(this._select.all(sid),this.len)},_select: DB.prepare(`SELECT * FROM ${table} WHERE sid=?`),
    count(sid){return DB.prepare(`SELECT COUNT(*) FROM ${table} WHERE sid=?`).get(sid)[`COUNT(*)`];},
    shift(sid,{cpu,mem,swap,ibw,obw}){
        if(this.count(sid)>=this.len)this._del.run(sid);
        this._ins.run({sid,cpu,mem,swap,ibw,obw});
    },_del:DB.prepare(`DELETE FROM ${table} WHERE sid=? LIMIT 1`),
    del_sid(sid){DB.prepare(`DELETE FROM ${table} WHERE sid=?`).run(sid)}
}
}
return {
    load_m:gen('load_m',60),
    load_h:gen('load_h',24),
};
}