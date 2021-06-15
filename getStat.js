"use strict";
const ssh=require("./ssh");
function sleep(ms){return new Promise(resolve=>setTimeout(()=>resolve(),ms));};
function analyze(data,interval=0.2){
    try{
    var [s1,s2,mem_res]=data.split('\n----\n'),
        [cpu1,net1]=s1.split('\n---\n'),
        [cpu2,net2]=s2.split('\n---\n');
    mem_res=mem_res.split('\n');
    }
    catch(e){return false}

    var sys1=[],cput1=[],sys2=[],cput2=[],per=[];
    for(var l of cpu1.split('\n')){
        var t=l.split(' '),tot=0;
        sys1.push(Number(t[3]));
        for(var x of t)tot+=Number(x);
        cput1.push(tot);
    }
    for(var l of cpu2.split('\n')){
        var t=l.split(' '),tot=0;
        sys2.push(Number(t[3]));
        for(var x of t)tot+=Number(x);
        cput2.push(tot);
    }
    for(var i in sys1)
        per.push(1-(sys2[i]-sys1[i])/(cput2[i]-cput1[i]));
    var cpu={
        multi:per.shift(),
        single:per,
    };

    var i1=0,o1=0,i2=0,o2=0;
    for(var l of net1.split('\n')){
        var t=l.trim().split(/\s+/);
        i1+=Number(t[1]),o1+=Number(t[9]);
    }
    for(var l of net2.split('\n')){
        var t=l.trim().split(/\s+/);
        i2+=Number(t[1]),o2+=Number(t[9]);
    }
    var net={
        delta:{in:(i2-i1)/interval,out:(o2-o1)/interval},
        total:{in:i2,out:o2}
    };

    var Mem=mem_res[0].split(/\s+/),Swap=mem_res[1].split(/\s+/),MEM=[],SWAP=[];
    for(var x of Mem)MEM.push(Number(x)*1000);
    for(var x of Swap)SWAP.push(Number(x)*1000);
    var mem={
        virtual:{total:MEM[1],used:MEM[2],free:MEM[3],shared:MEM[4],cache:MEM[5],available:MEM[6]},
        swap:{total:SWAP[1],used:SWAP[2],free:SWAP[3]}
    };
    return {cpu,mem,net};
}
async function get(key,interval=0.1){
    if(key.privateKey=='')delete key.privateKey;
    var con=await ssh.ssh_con(key);
    if(!con||!con.isConnected())return false;

    var sh=`
cat /proc/stat | grep cpu | awk '{print $2,$3,$4,$5,$6,$7,$8}'
echo '---'
cat /proc/net/dev | tail -n +3 | grep -v lo
echo '----'
sleep ${interval}
cat /proc/stat | grep cpu | awk '{print $2,$3,$4,$5,$6,$7,$8}'
echo '---'
cat /proc/net/dev | tail -n +3 | grep -v lo
echo '----'
free | tail -n +2
`;
    var data=await ssh.ssh_exec(con,sh);
    if(!data)return false;
    con.dispose();
    return analyze(data,interval);
}
module.exports={
    analyze,get
}
