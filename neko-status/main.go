package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"strconv"

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
	if show_version != false {
		fmt.Println("neko-status v1.0")
		return
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.GET("/stat", func(c *gin.Context) {
		res, err := GetStat()
		if err == nil {
			resp(c, true, res, 200)
		} else {
			resp(c, false, err, 500)
		}
	})
	fmt.Println("Api port:", Config.Port)
	fmt.Println("Api key:", Config.Key)
	r.Run(":" + strconv.Itoa(Config.Port))
}
func webMiddleware(c *gin.Context) {
	if c.Request.Header.Get("key") != Config.Key {
		resp(c, false, "Api key Incorrect", 500)
		c.Abort()
		return
	}
	c.Next()
}
