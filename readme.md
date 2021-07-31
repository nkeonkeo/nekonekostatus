## NekoNekoStatus

一个Material Design风格的服务器探针

- 默认密码: `nekonekostatus`
- 默认端口: 5555
- 默认被控下载地址: https://github.com/nkeonkeo/nekonekostatus/releases/download/v0.1/neko-status

安装后务必修改密码！

## Docker

## 一键脚本

请先安装`wget`

```bash
wget https://github.com/nkeonkeo/nekonekostatus/raw/main/install.sh && bash install.sh
```

## 手动安装

依赖: `nodejs`, `gcc/g++ version 8.x `, `git`

centos: 

```bash
yum install epel-release centos-release-scl -y
yum install nodejs devtoolset-8-gcc* git -y
scl enable devtoolset-8 bash
npm install n -g
n latest
```

debian/ubuntu:

```
apt-get install nodejs npm git -y
npm install n -g
scl enable devtoolset-8 bash
n latest
```

---

克隆仓库并安装所需第三方包

```bash
git clone https://github.com/nkeonkeo/nekonekostatus.git
cd nekonekostatus
npm install
```

## 配置 & 运行

复制`config.js.example`到`config.js`,并根据注释编辑配置

`node nekonekostatus.js` 即可运行

后台常驻, 请先安装`forever`(`npm install forever -g`),然后: `forever start nekonekostatus.js`

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