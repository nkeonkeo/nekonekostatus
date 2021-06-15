#!/bin/sh
cd /root/nekonekostatus/
forever start -o log/out.log -e log/err.log nekonekostatus.js
