## NekoNekoStatus

一个material design风格的探针

## 安装

依赖: `nodejs`, `gcc/g++ version 8.x `

centos: 

```bash
yum install centos-release-scl -y
yum install nodejs devtoolset-8-gcc* -y
scl enable devtoolset-8 bash
npm install n -g
n latest
```

debian/ubuntu:

```
apt-get install nodejs npm -y
npm install n -g
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

`node nekonekorelay.js` 即可运行

后台常驻, 请先安装`forever`(`npm intall forever -g`),然后: `forever start nekonekostatus.js`

https请使用nginx等反代