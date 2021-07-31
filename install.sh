#!/bin/bash
yum install epel-release -y
yum install centos-release-scl git -y
yum install nodejs devtoolset-8-gcc* -y

apt-get install nodejs npm git -y 

npm install n -g;
PATH="$PATH";
n latest;
PATH="$PATH"
npm install npm@latest -g;
PATH="$PATH"
npm install forever -g;
PATH="$PATH"
cd /root/
git clone https://github.com/nkeonkeo/nekonekostatus.git
cd nekonekostatus
scl enable devtoolset-8 bash
npm install
bash run.sh
echo "面板运行成功！"