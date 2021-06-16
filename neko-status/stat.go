package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/net"
)

func GetStat() (map[string]interface{}, error) {
	CPU1, err := cpu.Times(true)
	if err != nil {
		return nil, err
	}
	NET1, err := net.IOCounters(true)
	if err != nil {
		return nil, err
	}
	time.Sleep(200 * time.Millisecond)
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
	var in, out, in_total, out_total uint64
	in, out, in_total, out_total = 0, 0, 0, 0
	for i, x := range NET2 {
		if x.Name == "lo" {
			continue
		}
		in += x.BytesRecv - NET1[i].BytesRecv
		out += x.BytesSent - NET1[i].BytesSent
		in_total += x.BytesRecv
		out_total += x.BytesSent
	}
	host, err := host.Info()
	if err != nil {
		return nil, err
	}
	return gin.H{
		"cpu": gin.H{"multi": multi, "single": single},
		"net": gin.H{
			"delta": gin.H{
				"in":  float64(in) / 0.2,
				"out": float64(out) / 0.2,
			},
			"total": gin.H{
				"in":  in_total,
				"out": out_total,
			},
		},
		"mem": gin.H{
			"virtual": MEM,
			"swap":    SWAP,
		},
		"host": host,
	}, nil

}
