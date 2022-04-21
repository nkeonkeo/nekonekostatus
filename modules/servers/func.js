const ssh=require("../../ssh");
async function initServer(server,neko_status_url){
    var sh=
`bash <(curl -sSL 'https://cdn.jsdelivr.net/gh/mslxi/nekonekostatus@main/modules/servers/install.sh')
echo "key: ${server.data.api.key}
port: ${server.data.api.port}
debug: false" > /etc/neko-status/config.yaml
echo "[Unit]
Description=nekonekostatus

[Service]
Restart=always
RestartSec=5
ExecStart=/usr/bin/neko-status -c /etc/neko-status/config.yaml

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/nekonekostatus.service
systemctl daemon-reload
systemctl start nekonekostatus
systemctl enable nekonekostatus`
    var res=await ssh.Exec(server.data.ssh,sh);
    if(res.success)return {status:1,data:"安装成功"};
    else return {status:0,data:"安装失败/SSH连接失败"};
}
async function updateServer(server,neko_status_url){
    var sh=
`bash <(curl -sSL 'https://raw.githubusercontent.com/mslxi/nekonekostatus/main/modules/servers/install.sh')`
    await ssh.Exec(server.data.ssh,sh);
    return {status:1,data:"更新成功"};
}
module.exports={
    initServer,updateServer,
}
