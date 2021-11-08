## NekoNekoStatus

一个Material Design风格的服务器探针

- 默认访问端口: 5555
- 默认密码: `nekonekostatus`
- 默认被控下载地址: https://github.com/nkeonkeo/nekonekostatus/releases/download/v0.1/neko-status

安装后务必修改密码！

注意: 正处于快速开发迭代期，可能不保证无缝更新

Feature:

- 面板一键安装被控
- 负载监控、带宽监控、流量统计图表
- Telegram 掉线/恢复 通知
- 好看的主题 (卡片/列表、夜间模式)
- WEBSSH、脚本片段

TODOLIST:

- 主动通知模式
- 硬盘监控
- WEBSSH的一些小问题

## 一键脚本安装

在centos7/debian 10下测试成功，其他系统请自行尝试，参照[手动安装](#手动安装)

wget:

```bash
wget https://raw.githubusercontent.com/nkeonkeo/nekonekostatus/main/install.sh -O install.sh && bash install.sh
```

curl:

```bash
curl https://raw.githubusercontent.com/nkeonkeo/nekonekostatus/main/install.sh -o install.sh && bash install.sh
```

## 更新

记得备份数据库 (`database/db.db`)

```bash
cd /root/nekonekostatus
git pull
systemctl restart nekonekostatus-dashboard
```

## Docker

```bash
docker run --restart=on-failure --name nekonekostatus -p 5555:5555 -d nkeonkeo/nekonekostatus:latest
```

访问目标ip 5555端口即可,`5555:5555`可改成任意其他端口，如`2333:5555`

备份数据库: `/root/nekonekostatus/database/db.db`

## 手动安装

依赖: `nodejs`, `gcc/g++ version 8.x `, `git`

centos: 

```bash
yum install epel-release -y && yum install centos-release-scl git -y && yum install nodejs devtoolset-8-gcc* -y
bash -c "npm install n -g"
source /root/.bashrc
bash -c "n latest"
source /root/.bashrc
bash -c "npm install npm@latest -g"
source /root/.bashrc
```

debian/ubuntu:

```bash
apt update -y && apt-get install nodejs npm git build-essential -y
bash -c "npm install n -g"
source /root/.bashrc
bash -c "n latest"
source /root/.bashrc
bash -c "npm install npm@latest -g"
source /root/.bashrc
```

---

克隆仓库并安装所需第三方包

```bash
git clone https://github.com/nkeonkeo/nekonekostatus.git
cd nekonekostatus
source /opt/rh/devtoolset-8/enable
npm install
```

## 配置 & 运行

`node nekonekostatus.js` 即可运行

后台常驻:

1. 安装`forever`(`npm install forever -g`),然后: `forever start nekonekostatus.js`
   
2. 使用systemd
   
```bash
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
```

https请使用nginx等反代

## 新增/配置 服务器

|变量名|含义|示例|
|-|-|-|
|`sid`|服务器id|`b82cbe8b-1769-4dc2-b909-5d746df392fb`|
|`name`|服务器名称|`localhost`|
|`TOP`|置顶优先级|`1`|
|域名/IP|域名/IP|`127.0.0.1`|
|端口(可选)|ssh端口|`22`|
|密码(可选)|ssh密码|`114514`|
|私钥(可选)|ssh私钥|``|
|被动/主动 同步|同步数据模式|被动(关闭)即可|
|被动通讯端口|被动通讯端口|`10086`|

填写ssh保存后即可一键安装/更新后端 (更新后要重新点一下安装)

## 手动安装被控

```bash
wget --version||yum install wget -y||apt-get install wget -y
/usr/bin/neko-status -v||(wget 被控下载地址 -O /usr/bin/neko-status && chmod +x /usr/bin/neko-status)
systemctl stop nekonekostatus
mkdir /etc/neko-status/
echo "key: 通讯秘钥
port: 通讯端口
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
```