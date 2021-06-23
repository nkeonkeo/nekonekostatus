#!/bin/bash
yum install epel-release centos-release-scl git -y && yum install nodejs devtoolset-8-gcc* -y && scl enable devtoolset-8 bash
apt-get install nodejs npm git -y 

npm install n -g && n latest
PATH="$PATH"
npm install npm@latest -g
PATH="$PATH"
npm install forever -g
cd /root/
git clone https://github.com/nkeonkeo/nekonekostatus.git
cd nekonekostatus
npm install

read -p "请输入监听端口 :" port
read -p "请输入面板名称(eg: Neko Neko Status) :" site_name
read -p "请输入面板网址(eg: https://status.nekoneko.cloud) :" site_url
read -p "请输入面板密码(eg: nekonekocloud) :" password

echo "module.exports={
port:$port, //监听端口
site:{
    url: '$site_url', // 站点地址
    name: '$site_name', // 站点名称
},
noCache:false, //html模板缓存
admin:{
    password:'$password' //面板管理密码
},
neko_status_url:'https://github.com.cnpmjs.org/nkeonkeo/nekonekostatus/releases/download/v0.1/neko-status' //neko-status后端下载地址
}" > config.js
mkdir log
bash run.sh

echo "面板运行成功！"
