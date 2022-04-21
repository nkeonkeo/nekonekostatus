#!/bin/bash
sys=$(cat /etc/issue)
cent=$(cat /etc/redhat-release 2>/dev/null)
if [[ $(cat /etc/redhat-release 2>/dev/null |grep -i -E 'centos') != "" ]];then
  a=yum
elif [[ $(cat /etc/issue 2>/dev/null |grep -i -E 'debian|ubuntu') != "" ]];then
  a=apt
else 
  echo "不支持当前系统"
  exit 1
fi

if ! [ -x "$(command -v curl)" ];then
  ${a} update -y >>/dev/null 2>&1
  ${a} install curl -y >>/dev/null 2>&1
fi

if ! [ -x "$(command -v wget)" ];then
  ${a} update -y >>/dev/null 2>&1
  ${a} install wget -y >>/dev/null 2>&1
fi

[[ -f /usr/bin/neko-status ]] && rm -rf /usr/bin/neko-status && systemctl stop nekonekostatus
[[ ! -d /etc/neko-status/ ]] && mkdir /etc/neko-status/

CPU=$(uname -m)
if [[ "$CPU" == "aarch64" ]];then
  cpu=arm64
elif [[ "$CPU" == "arm" ]];then
  cpu=arm7
elif [[ "$CPU" == "x86_64" ]];then
  cpu=amd64
elif [[ "$CPU" == "s390x" ]];then
  cpu=s390x
else
  exit 1
fi

if [[ $(curl -m 10 -s https://ipapi.co/json | grep 'China') != "" ]];then
  URL="dn-dao-github-mirror.daocloud.io"
else
  URL="github.com"
fi

wget https://${URL}/nkeonkeo/nekonekostatus/releases/download/v0.1/neko-status_linux_${cpu} -O /usr/bin/neko-status 
chmod +x /usr/bin/neko-status
