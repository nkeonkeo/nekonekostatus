#!/bin/bash
if [[ ! "$(command -v wget)" ]]
then a=apt
cent=$(cat /etc/redhat-release 2>/dev/null)
if [[ $(echo $cent |grep -i -E 'centos') != "" ]]
then a=yum;
fi
$a update -y >>/dev/null 2>&1
$a install wget -y >>/dev/null 2>&1
fi

systemctl stop nekonekostatus
[[ -f /usr/bin/neko-status ]] && rm -rf /usr/bin/neko-status && systemctl stop nekonekostatus
[[ ! -d /etc/neko-status/ ]] && mkdir /etc/neko-status/

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
elif [[ "$CPU" == "s390x" ]]
then
    cpu=s390x
else
exit 1
fi
wget https://github.com/nkeonkeo/nekonekostatus/releases/download/v0.1/neko-status_linux_${cpu} -O /usr/bin/neko-status && chmod +x /usr/bin/neko-status
