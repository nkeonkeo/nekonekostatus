package walled

import (
	"net"
	"time"
)

var Walled = false

func MonitorWalled() {
	for {
		Walled = TestWalled()
		time.Sleep(60 * time.Second)
	}
}

func TestWalled() bool {
	for i := 0; i < 3; i++ {
		if !walled() {
			return false
		}
	}
	return true
}

func walled() bool {
	d := net.Dialer{Timeout: 10 * time.Second}
	c, err := d.Dial("tcp", "www.baidu.com:80")
	if err == nil {
		c.Close()
		return false
	} else {
		return true
	}
}
