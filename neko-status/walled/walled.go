package walled

import (
	"net"
	"time"
)

func init() {
	go TestWalled()
}

var Walled = false

func MonitorWalled() {
	for {
		Walled = TestWalled()
		time.Sleep(60 * time.Second)
	}
}

func TestWalled() bool {
	retry := 3
TRY:
	d := net.Dialer{Timeout: 10 * time.Second}
	c, err := d.Dial("tcp", "www.baidu.com:80")
	if err == nil {
		c.Close()
		return false
	} else {
		retry--
		if retry == 0 {
			return true
		}
		goto TRY
	}
}
