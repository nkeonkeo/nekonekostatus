const {NodeSSH}=require('node-ssh');
const SSHClient = require("ssh2").Client;
async function ssh_con(key){
    if(!key.privateKey||key.privateKey=='')delete key.privateKey;
    key.readyTimeout=10000;
    try{
        var ssh=new NodeSSH();
        await ssh.connect(key);
        ssh.connection.on("error",(err)=>{});
    } catch(e){return null;}
    return ssh;
}
async function ssh_exec(ssh,sh){
    try{
        var res=await ssh.execCommand(sh,{onStdout:null,});
        return {success:true,data:res.stdout};;
    }
    catch(e){
        // console.log(e);
        return {success:false,data:e};
    }
}
async function spwan(key,sh,onData=(chunk)=>{process.stdout.write(chunk)}){
    if(key.privateKey=='')delete key.privateKey;
    key.readyTimeout=10000;
    try{
        var ssh=new NodeSSH();
        await ssh.connect(key);
        ssh.connection.on("error",(err)=>{});
        var res=await ssh.execCommand(sh,{
            onStdout:onData,
        });
        await ssh.dispose();
        return {success:true,data:res.stdout};
    }catch(e){return {success:false,data:e};}
}
async function exec(key,sh){
    if(key.privateKey=='')delete key.privateKey;
    key.readyTimeout=60000;
    try{
        var ssh=new NodeSSH();
        await ssh.connect(key);
        ssh.connection.on("error",(err)=>{});
        var res=await ssh.execCommand(sh,{});
        await ssh.dispose();
        return {success:true,data:res.stdout};
    }catch(e){return {success:false,data:e};}
}
async function createSocket(key,ws,conf={}){
    const ssh = new SSHClient();
    ssh.on("ready",()=>{
        if(ws)ws.send("\r\n*** SSH CONNECTION ESTABLISHED ***\r\n".toString('utf-8'));
        else return;
        ssh.shell((err, stream)=>{
            if(err){
                try{ws.send("\n*** SSH SHELL ERROR: " + err.message + " ***\n".toString('utf-8'));}catch{}
                return;                
            }
            if(conf.cols||conf.rows)stream.setWindow(conf.rows,conf.cols);
            if(conf.sh)stream.write(conf.sh);
            ws.on("message", (data)=>{stream.write(data);});
            ws.on("resize",(data)=>{stream.setWindow(data.rows,data.cols)})
            ws.on("close",()=>{ssh.end()});
            stream.on("data", (data)=>{try{ws.send(data.toString('utf-8'));}catch{}})
                .on("close",()=>{ssh.end()});
        });
    }).on("close",()=>{
        try{ws.close()}catch{}})
    .on("error",(err)=>{
        try{
            ws.send("\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n");
            ws.close();
        } catch {}
    }).connect(key);
}
function toJSON(x){return JSON.stringify(x);}
var sshCons={},sshConTime={};
async function Exec(key,cmd,verbose=0){
    if(!key.privateKey)delete key.privateKey;
    if(!key.password)delete key.password;
    var k=toJSON(key);
    var con=sshCons[k];
    if(con&&con.isConnected()){
        if((new Date())-sshConTime[k]>120000){
            await con.dispose();
            con=await ssh_con(key);
            sshConTime[k]=new Date();
        }
    }
    else{
        con=await ssh_con(key);
        sshConTime[k]=new Date();
    }
    sshCons[k]=con;
    var res=await ssh_exec(con,cmd);
    if(verbose)console.log(key.host,cmd,res);
    return res;
}
async function pidS(key,keyword){
    var x=await Exec(key,`ps -aux|grep ${keyword}|awk '{print $2}'`);
    if(!x.success)return false;
    var pids=x.data.trim().split('\n'),pS=new Set();
    for(var pid of pids)pS.add(pid);
    return pS;
}
async function netStat(key,keyword){
    var x=await Exec(key,`netstat -lp | grep ${keyword}`);
    if(!x.success)return {};
    var lines=x.data.trim().split('\n'),res={};
    try{
    for(var line of lines)if(line){
        var rows=line.trim().split(/\s+/);
        var port=rows[3].split(':').pop(),pid=rows.pop().split('/')[0];
        if(Number(port))res[Number(port)]=pid;
    }
    }
    catch{}
    return res;
}
module.exports={
    exec,spwan,
    ssh_con,ssh_exec,
    Exec,
    createSocket,
    netStat,pidS,
}
