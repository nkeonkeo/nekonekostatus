#!/bin/bash
docker login
docker build -t nekonekostatus .
docker tag nekonekostatus:latest nkeonkeo/nekonekostatus
docker push nkeonkeo/nekonekostatus