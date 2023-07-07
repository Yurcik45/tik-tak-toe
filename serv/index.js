const WS = require("ws")
require('dotenv').config()

const port = process.env['PORT']

const wss = new WS.Server({ port }, () => console.log(`SERV: websocket started on port: ${port}`))

wss.on('connection', (ws, req) => {
  const raw_headers = req.rawHeaders
  const origin = raw_headers[raw_headers.indexOf('Origin') + 1]
  console.log("request from: ", origin)
  ws.isAlive = true
  ws.on('error', console.error)
  console.log("new ws user", ws)
  ws.send("hello, new user")
  ws.on('message', msg => console.log("message from user: ", JSON.parse(msg)))
  ws.on('close', () => console.log("user disconnected"))
})
