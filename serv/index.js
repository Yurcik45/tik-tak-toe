const WS = require("ws")
require('dotenv').config()
const { db_init, make_query } = require('./db_queries')
const { log_battle_rows } = require('./tools')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/battles', async (req, res) =>
{
  const data = await make_query()
  console.log("getting battles API result:")
  log_battle_rows(data)
  res.status(200).json(data.rows)
})

app.listen(5000, () => console.log("serv started on port 5000"))

const init = async () => await db_init()

const port = process.env['PORT']

const wss = new WS.Server({ port }, () => console.log(`SERV: websocket started on port: ${port}`))

const ws_message_handler = (ws, name, message) =>
{
  console.log("===== ws_message_handler =====")
  console.log({name, message})
  console.log("===== ===== ===== ===== =====")
  switch (message) {
    case "start":
      make_query("create", { player1_name: name })
      .then(() =>
      {
        ws.send(JSON.stringify({ title: "created", msg: "battle was created" }))
        console.log("after sending msg in case start")
      })
      break
    case "test":
      console.log("test message from ", name)
      ws.send(JSON.stringify({ title: "test", msg: "teeest" }))
      console.log("after sending msg in case test")
      break
    default: break
  }
}

wss.on('connection', (ws, req) => {
  const raw_headers = req.rawHeaders
  const origin = raw_headers[raw_headers.indexOf('Origin') + 1]
  console.log("request from: ", origin)
  ws.isAlive = true
  ws.on('error', console.error)
  ws.send(JSON.stringify({ title: "hello", msg: `hello, ${origin}!` }))
  ws.on('message', msg => ws_message_handler(ws, origin, JSON.parse(msg)))
  ws.on('close', () => console.log("user disconnected"))
})

init()
