package stat

import (
	"neko-status/walled"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/net"
)

func GetStat() (map[string]interface{}, error) {
	timer := time.NewTimer(500 * time.Millisecond)
	res := gin.H{
		"walled": walled.Walled,
	}
	CPU1, err := cpu.Times(true)
	if err != nil {
		return nil, err
	}
	NET1, err := net.IOCounters(true)
	if err != nil {
		return nil, err
	}
	<-timer.C
	CPU2, err := cpu.Times(true)
	if err != nil {
		return nil, err
	}
	NET2, err := net.IOCounters(true)
	if err != nil {
		return nil, err
	}
	MEM, err := mem.VirtualMemory()
	if err != nil {
		return nil, err
	}
	SWAP, err := mem.SwapMemory()
	if err != nil {
		return nil, err
	}
	res["mem"] = gin.H{
		"virtual": MEM,
		"swap":    SWAP,
	}

	single := make([]float64, len(CPU1))
	var idle, total, multi float64
	idle, total = 0, 0
	for i, c1 := range CPU1 {
		c2 := CPU2[i]
		single[i] = 1 - (c2.Idle-c1.Idle)/(c2.Total()-c1.Total())
		idle += c2.Idle - c1.Idle
		total += c2.Total() - c1.Total()
	}
	multi = 1 - idle/total
	// info, err := cpu.Info()
	// if err != nil {
	// 	return nil, err
	// }
	res["cpu"] = gin.H{
		// "info":   info,
		"multi":  multi,
		"single": single,
	}

	var in, out, in_total, out_total uint64
	in, out, in_total, out_total = 0, 0, 0, 0
	res["net"] = gin.H{
		"devices": gin.H{},
	}
	for i, x := range NET2 {
		_in := x.BytesRecv - NET1[i].BytesRecv
		_out := x.BytesSent - NET1[i].BytesSent
		res["net"].(gin.H)["devices"].(gin.H)[x.Name] = gin.H{
			"delta": gin.H{
				"in":  float64(_in) / 0.5,
				"out": float64(_out) / 0.5,
			},
			"total": gin.H{
				"in":  x.BytesRecv,
				"out": x.BytesSent,
			},
		}
		if x.Name == "lo" {
			continue
		}
		in += _in
		out += _out
		in_total += x.BytesRecv
		out_total += x.BytesSent
	}
	res["net"].(gin.H)["delta"] = gin.H{
		"in":  float64(in) / 0.5,
		"out": float64(out) / 0.5,
	}
	res["net"].(gin.H)["total"] = gin.H{
		"in":  in_total,
		"out": out_total,
	}
	host, err := host.Info()
	if err != nil {
		return nil, err
	}
	res["host"] = host

	return res, nil
}
