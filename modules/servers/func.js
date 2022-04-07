const ssh=require("../../ssh");
async function initServer(server,neko_status_url){
    var sh=
`bash ./install.sh`
    var res=await ssh.Exec(server.data.ssh,sh);
    if(res.success)return {status:1,data:"安装成功"};
    else return {status:0,data:"安装失败/SSH连接失败"};
}
async function updateServer(server,neko_status_url){
    var sh=
`rm -f /usr/bin/neko-status
wget ${neko_status_url} -O /usr/bin/neko-status
chmod +x /usr/bin/neko-status`
    await ssh.Exec(server.data.ssh,sh);
    return {status:1,data:"更新成功"};
}
module.exports={
    initServer,updateServer,
}
