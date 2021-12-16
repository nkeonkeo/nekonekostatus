package iperf3

import (
	"io"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

type Stat struct {
	Type     string
	Interval string
	Transfer uint64
	Bitrate  uint64
	Retr     uint64
}

type Result struct {
	Success bool
	Stats   []Stat
	Total   Stat
}

const iperf3path = "/usr/bin/iperf3"
const timeout = 5000

func toStat(str string) Stat {
	t := strings.Fields(str[5:])
	log.Println(str, t)
	Transfer, _ := strconv.ParseFloat(t[2], 10)
	var transfer uint64
	switch t[3] {
	case "TBytes":
		transfer = uint64(Transfer) * 1024 * 1024 * 1024 * 1024
	case "GBytes":
		transfer = uint64(Transfer) * 1024 * 1024 * 1024
	case "MBytes":
		transfer = uint64(Transfer) * 1024 * 1024
	case "KBytes":
		transfer = uint64(Transfer) * 1024
	}
	bitrate, _ := strconv.Atoi(t[4])
	stat := Stat{
		Interval: t[0],
		Transfer: transfer,
		Bitrate:  uint64(bitrate),
	}
	if len(t) > 7 {
		retr, _ := strconv.Atoi(t[6])
		stat.Retr = uint64(retr)
	}
	// log.Println(str,stat)
	return stat
}

func AnalStdout(stdout io.Reader, multi bool, ws *websocket.Conn) (res Result) {
	waitID := true
	buf := make([]byte, 2048)
	for {
		n, err := stdout.Read(buf)
		if err != nil {
			break
		}
		str := string(buf[:n])
		for _, L := range strings.Split(str, "\n") {
			l := strings.TrimSpace(L)
			if l == "" {
				continue
			}
			if waitID {
				if strings.HasPrefix(l, "[ ID]") {
					waitID = false
				}
				continue
			}
			if l[0] != '[' || (multi && l[1] != 'S') {
				continue
			}
			if strings.HasSuffix(l, "Mbits/sec") {
				stat := toStat(l)
				stat.Type = "interval"
				res.Stats = append(res.Stats, stat)
				if ws != nil {
					ws.WriteJSON(stat)
				}
			}
			if strings.HasSuffix(l, "sender") {
				stat := toStat(l)
				stat.Type = "total"
				res.Total = stat
			}
		}
	}
	res.Success = true
	if ws != nil {
		ws.WriteJSON(res)
		ws.Close()
	}
	// log.Println(res)
	return
}

func Iperf3(host string, port int, reverse bool, ti int, parallel int, protocol string, ws *websocket.Conn) (res Result, err error) {
	Args := []string{
		iperf3path,
		"-c", host,
		"-p", strconv.Itoa(port),
		"-P", strconv.Itoa(parallel),
		"-t", strconv.Itoa(ti),
		"--connect-timeout", strconv.Itoa(timeout),
		"--rcv-timeout", strconv.Itoa(timeout),
		"--forceflush",
		"-f", "mbps",
	}
	if reverse {
		Args = append(Args, "-R")
	}
	if protocol == "udp" {
		Args = append(Args, "-u")
	}
	cmd := exec.Cmd{
		Path:   iperf3path,
		Args:   Args,
		Stderr: os.Stderr,
	}
	stdout, _ := cmd.StdoutPipe()
	if err = cmd.Start(); err != nil {
		res.Success = false
		return
	}
	res = AnalStdout(stdout, parallel > 1, ws)
	cmd.Wait()
	return
}
