const {NodeSSH}=require('node-ssh');
async function ssh_con(key){
    if(!key.privateKey||key.privateKey=='')delete key.privateKey;
    key.readyTimeout=5000;
    key.tryKeyboard=true;
    var ssh=new NodeSSH();
    try{await ssh.connect(key);}
    catch(e){return null;}
    return ssh;
}
async function ssh_exec(ssh,sh){
    try{
    var res=await ssh.execCommand(sh,{
        onStdout:null,
    });
    return res.stdout;
    }
    catch(e){return '';}
}
async function spwan(key,sh,onData=(chunk)=>{process.stdout.write(chunk)}){
    if(key.privateKey=='')delete key.privateKey;
    key.readyTimeout=5000;
    key.tryKeyboard=true;
    try{
    var ssh=new NodeSSH();
    await ssh.connect(key);
    var res=await ssh.execCommand(sh,{
        onStdout:onData,
    });
    ssh.dispose();
    return res.stdout;
    }catch(e){return '';}
}
async function exec(key,sh){
    if(key.privateKey=='')delete key.privateKey;
    key.readyTimeout=5000;
    key.tryKeyboard=true;
    try{
    var ssh=new NodeSSH();
    await ssh.connect(key);
    var res=await ssh.execCommand(sh,{});
    ssh.dispose();
    return res.stdout;
    }catch(e){return '';}
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
    var pids=(await Exec(key,`ps -aux|grep ${keyword}|awk '{print $2}'`)).trim().split('\n'),pS=new Set();
    for(var pid of pids)pS.add(pid);
    return pS;
}
async function netStat(key,keyword){
    var lines=(await Exec(key,`netstat -lp | grep ${keyword}`)||' ').trim().split('\n'),res={};
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
    Exec,netStat,pidS,
}
