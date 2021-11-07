#!/bin/bash

clear && echo "\
############################################################

Neko Neko Status 一键安装脚本

上次更新: 2021-11-07

Powered by Neko Neko Cloud

############################################################
"

echo "安装即将开始

如果您想取消安装, 请在 5 秒钟内按 Ctrl+C 终止此脚本"
sleep 5


clear && echo "正在安装npm,git,gcc"

yum install epel-release -y && yum install centos-release-scl git -y && yum install nodejs devtoolset-8-gcc* -y
apt update -y && apt-get install nodejs npm git build-essential -y

clear && echo "正在更新npm"
bash -c "npm install n -g"
source /root/.bashrc
bash -c "n latest"
source /root/.bashrc
bash -c "npm install npm@latest -g"
source /root/.bashrc
bash -c "npm install forever -g"
source /root/.bashrc
cd /root/
clear && echo "正在克隆仓库"
git clone https://github.com/nkeonkeo/nekonekostatus.git
cd nekonekostatus
git pull
clear && echo "正在安装依赖模块"
source /opt/rh/devtoolset-8/enable
npm install

echo "安装完成, 正在启动面板"

echo "[Unit]
Description=nekonekostatus

[Service]
Type=simple
ExecStart=/root/nekonekostatus/nekonekostatus.js

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/nekonekostatus-dashboard.service
systemctl daemon-reload
systemctl enable nekonekostatus-dashboard.service
systemctl start nekonekostatus-dashboard.service
sleep 3
if systemctl status nekonekostatus-dashboard.service | grep "active (running)" > /dev/null
then
    echo "面板启动成功"
    echo ""
    echo "默认访问端口: 5555"
    echo "默认密码: nekonekostatus"
    echo ""
    echo "请及时修改密码！"
    echo ""
    echo "------------"
    echo ""
    echo "TIPS: "
    echo "若无法访问, 请先尝试卸载防火墙, 并检查iptables规则"
    echo "CentOS: yum remove firewalld -y"
    echo "Debian: apt remove ufw -y"    
else
    echo "面板启动失败"
    systemctl status nekonekostatus-dashboard.service
fi