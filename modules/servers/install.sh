#!/bin/bash
if [[ "$(command -v wget)" ]]
them echo ""
else
apt update -y >>/dev/null 2>&1
apt install wget -y >>/dev/null 2>&1
fi
CPU=$(uname -m)
if [[ "$CPU" == "aarch64" ]]
then
  cpu=arm64
elif [[ "$CPU" == "arm" ]]
then
  cpu=arm7
elif [[ "$CPU" == "x86_64" ]]
then
  cpu=amd64
else
exit 1
fi
wget https://github.com/nkeonkeo/nekonekostatus/releases/download/v0.1/neko-status_linux_${cpu} -O /usr/bin/neko-status && chmod +x /usr/bin/neko-status
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
systemctl enable nekonekostatus