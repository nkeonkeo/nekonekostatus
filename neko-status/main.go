package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"strconv"

	"neko-status/stat"
	"neko-status/walled"

	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v2"
)

var (
	Config CONF
)

func resp(c *gin.Context, success bool, data interface{}, code int) {
	c.JSON(code, gin.H{
		"success": success,
		"data":    data,
	})
}
func main() {
	var confpath string
	var show_version bool
	flag.StringVar(&confpath, "c", "", "config path")
	flag.IntVar(&Config.Mode, "mode", 0, "access mode")
	flag.StringVar(&Config.Key, "key", "", "access key")
	flag.IntVar(&Config.Port, "port", 8080, "port")
	flag.BoolVar(&show_version, "v", false, "show version")
	flag.Parse()

	if confpath != "" {
		data, err := ioutil.ReadFile(confpath)
		if err != nil {
			log.Panic(err)
		}
		err = yaml.Unmarshal([]byte(data), &Config)
		if err != nil {
			panic(err)
		}
		// fmt.Println(Config)
	}
	if show_version {
		fmt.Println("neko-status v1.0")
		return
	}
	go walled.MonitorWalled()
	API()
}
func API() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(checkKey)
	r.GET("/stat", Stat)
	r.GET("/iperf3", Iperf3)
	r.GET("/iperf3ws", Iperf3Ws)
	r.GET("/walled", Stat)
	fmt.Println("Api port:", Config.Port)
	fmt.Println("Api key:", Config.Key)
	r.Run(":" + strconv.Itoa(Config.Port))
}
func checkKey(c *gin.Context) {
	if c.Request.Header.Get("key") == Config.Key || c.Query("key") == Config.Key {
		c.Next()
	} else {
		resp(c, false, "Api key Incorrect", 500)
		c.Abort()
	}
}

func Stat(c *gin.Context) {
	res, err := stat.GetStat()
	if err == nil {
		resp(c, true, res, 200)
	} else {
		resp(c, false, err, 500)
	}
}
