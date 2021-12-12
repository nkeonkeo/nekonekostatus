package main

import (
	"neko-status/mtr"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Mtr(c *gin.Context) {
	host := c.PostForm("host")
	count, _ := strconv.Atoi(c.PostForm("count"))
	if count == 0 {
		count = 10
	}
	res, err := mtr.Mtr(host, count, true, nil)
	if err == nil {
		resp(c, true, res, 200)
	} else {
		resp(c, false, err, 500)
	}
}

func MtrWs(c *gin.Context) {
	host := c.Query("host")
	count, _ := strconv.Atoi(c.Query("count"))
	if count == 0 {
		count = 10
	}
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	mtr.Mtr(host, count, true, ws)
}
