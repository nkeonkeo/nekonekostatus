const ssh=require("../../ssh");
async function initServer(server,neko_status_url){
    var sh=
`/usr/bin/neko-status -v||(wget ${neko_status_url} -O /usr/bin/neko-status && chmod +x /usr/bin/neko-status)
systemctl stop nekonekostatus
mkdir /etc/neko-status/
echo "key: ${server.data.api.key}
port: ${server.data.api.port}
debug: false" > /etc/neko-status/config.yaml
systemctl stop nekonekostatus
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
    await ssh.Exec(server.data.ssh,sh);
    return {status:1,data:"安装成功"};
}
module.exports={
    initServer
}