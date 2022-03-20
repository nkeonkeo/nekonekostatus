#!/bin/sh
mkdir build -p

echo "build neko-status..."
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status
echo "build linux amd64..."
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status_linux_amd64
echo "build darwin amd64..."
CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status_darwin_amd64
# echo "build windows amd64..."
# CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status_windows_amd64.exe
echo "build freebsd amd64..."
CGO_ENABLED=0 GOOS=freebsd GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status_freebsd_amd64
echo "build openbsd amd64..."
CGO_ENABLED=0 GOOS=openbsd GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status_openbsd_amd64
echo "build netbsd amd64..."
CGO_ENABLED=0 GOOS=netbsd GOARCH=amd64 go build -ldflags="-w -s" -o build/neko-status_netbsd_amd64

echo "build linux arm64..."
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o build/neko-status_linux_arm64
echo "build darwin arm64..."
CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -ldflags="-w -s" -o build/neko-status_darwin_arm64

echo "build linux 386..."
CGO_ENABLED=0 GOOS=linux GOARCH=386 go build -ldflags="-w -s" -o build/neko-status_linux_386
# echo "build windows 386..."
# CGO_ENABLED=0 GOOS=windows GOARCH=386 go build -ldflags="-w -s" -o build/neko-status_windows_386.exe
echo "build freebsd 386..."
CGO_ENABLED=0 GOOS=freebsd GOARCH=386 go build -ldflags="-w -s" -o build/neko-status_freebsd_386
echo "build openbsd 386..."
CGO_ENABLED=0 GOOS=openbsd GOARCH=386 go build -ldflags="-w -s" -o build/neko-status_openbsd_386
echo "build netbsd 386..."
CGO_ENABLED=0 GOOS=netbsd GOARCH=386 go build -ldflags="-w -s" -o build/neko-status_netbsd_386

echo "build linux arm7..."
CGO_ENABLED=0 GOOS=linux GOARCH=arm GOARM=7 go build -ldflags="-w -s" -o build/neko-status_linux_arm7
echo "build linux arm6..."
CGO_ENABLED=0 GOOS=linux GOARCH=arm GOARM=6 go build -ldflags="-w -s" -o build/neko-status_linux_arm6
echo "build linux arm5..."
CGO_ENABLED=0 GOOS=linux GOARCH=arm GOARM=5 go build -ldflags="-w -s" -o build/neko-status_linux_arm5

echo "build linux mips..."
CGO_ENABLED=0 GOOS=linux GOARCH=mips go build -ldflags="-w -s" -o build/neko-status_linux_mips
echo "build linux mipsle..."
CGO_ENABLED=0 GOOS=linux GOARCH=mipsle go build -ldflags="-w -s" -o build/neko-status_linux_mipsle
echo "build linux mips_softfloat..."
CGO_ENABLED=0 GOOS=linux GOARCH=mips GOMIPS=softfloat go build -ldflags="-w -s" -o build/neko-status_linux_mips_softfloat
echo "build linux mipsle_softfloat..."
CGO_ENABLED=0 GOOS=linux GOARCH=mipsle GOMIPS=softfloat go build -ldflags="-w -s" -o build/neko-status_linux_mipsle_softfloat
echo "build linux mips64 ..."
CGO_ENABLED=0 GOOS=linux GOARCH=mips64 go build -ldflags="-w -s" -o build/neko-status_linux_mips64
echo "build linux mips64le ..."
CGO_ENABLED=0 GOOS=linux GOARCH=mips64le go build -ldflags="-w -s" -o build/neko-status_linux_mips64le
echo "build linux mips64_softfloat ..."
CGO_ENABLED=0 GOOS=linux GOARCH=mips64 GOMIPS=softfloat go build -ldflags="-w -s" -o build/neko-status_linux_mips64_softfloat
echo "build linux mips64le_softfloat ..."
CGO_ENABLED=0 GOOS=linux GOARCH=mips64le GOMIPS=softfloat go build -ldflags="-w -s" -o build/neko-status_linux_mips64le_softfloat

echo "build linux ppc64 ..."
CGO_ENABLED=0 GOOS=linux GOARCH=ppc64 go build -ldflags="-w -s" -o build/neko-status_linux_ppc64
echo "build linux ppc64le ..."
CGO_ENABLED=0 GOOS=linux GOARCH=ppc64le go build -ldflags="-w -s" -o build/neko-status_linux_ppc64le