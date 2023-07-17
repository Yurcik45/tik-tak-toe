const WS = require("ws");
require("dotenv").config();
const { db_init, make_query } = require("./db_queries");
const { log_battle_rows } = require("./tools");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/battles", async (req, res) => {
  const data = await make_query();
  console.log("getting battles API result:");
  log_battle_rows(data);
  res.status(200).json(data.rows);
});

app.listen(process.env['SERV_PORT'] ?? 5000, process.env['SERV_HOST'] ?? "localhost", () =>
  console.log("serv started on port 5000")
);

const init = async () => await db_init();

const port = process.env["WS_PORT"];

const wss = new WS.Server({ port }, () =>
  console.log(`SERV: websocket started on port: ${port}`)
);

const check_rows_case = (res, message) => {
  console.log(`====== ${message.title} case`);
  if (res.rows.length === 0) {
    console.log("FAILED\n", { res, message });
    return false;
  }
  log_battle_rows(res);
  console.log("==============================");
  return true;
};

const ws_message_handler = (ws, name, message) => {
  console.log("===== ws_message_handler =====");
  console.log({ name, message });
  console.log("===== ===== ===== ===== =====");
  const { title } = message;
  switch (title) {
    case "create_game":
      make_query("create", { player1_name: name }).then((res) => {
        if (!check_rows_case(res, message)) return;
        wss.clients.forEach((client) =>
          client.send(
            JSON.stringify({
              title: "game_created",
              msg: "battle was created",
              battle_data: res.rows[0],
            })
          )
        );
        console.log("after sending msg in case start");
      });
      break;
    case "connect_to_battle":
      make_query("start", {
        id: message.id,
        player2_name: message.player2_name,
      }).then((res) => {
        if (!check_rows_case(res, message)) return;
        wss.clients.forEach((client) => {
          const ws_origin = client.origin;
          const battle_data = res.rows[0];
          const { player1_name, player2_name } = battle_data;
          console.log({ ws_origin, player1_name, player2_name });
          if (player1_name === ws_origin || player2_name === ws_origin) {
            client.send(
              JSON.stringify({
                title: "game_started",
                battle_data: res.rows[0],
                new_user_name: player2_name,
              })
            );
          }
        });
      });
      break;
    case "step":
      console.log("STEP CASE", message);
      make_query("get_one", { id: message.battle_data.id }).then((res) => {
        if (!check_rows_case(res, message)) return;
        make_query("update_data", {
          id: message.battle_data.id,
          game_data: message.game_data,
          last_step_player: message.battle_data.player1_name === message.battle_data.last_step_player ? message.battle_data.player2_name : message.battle_data.player1_name,
        }).then((updated_battle) => {
          console.log("updated battle in step case: ");
          if (!check_rows_case(updated_battle, message)) return;
          wss.clients.forEach((client) => {
            const ws_origin = client.origin;
            const battle_data = updated_battle.rows[0];
            const { player1_name, player2_name } = battle_data;
            if (player1_name === ws_origin || player2_name === ws_origin)
              client.send(
                JSON.stringify({ title: "step", battle: battle_data })
              );
          });
        });
      });
      break;
    case "finish_game":
      const { id, game_data } = message;
      make_query("finish", { id, game_data }).then((res) => {
        if (!check_rows_case(res, message)) return;
        console.log("game finished OK");
      });
    default:
      break;
  }
};

wss.on("connection", (ws, req) => {
  const raw_headers = req.rawHeaders;
  const origin = raw_headers[raw_headers.indexOf("Origin") + 1];
  console.log("request from: ", origin);
  ws.isAlive = true;
  ws.origin = origin;
  ws.on("error", console.error);
  ws.send(JSON.stringify({ title: "hello", msg: `hello, ${origin}!` }));
  ws.on("message", (msg) => ws_message_handler(ws, origin, JSON.parse(msg)));
  ws.on("close", () => {
    // get battle via on eof players name
    make_query("get_one_by_name", { name: origin }).then((res) => {
      if (!check_rows_case(res, { title: "general get_one_by_name" })) return;
      make_query("delete", { id: res.rows[0].id }).then((del_res) => {
        if (!check_rows_case(del_res, { title: "general delete" })) return;
        wss.clients.forEach((client) => {
          const ws_origin = client.origin;
          const battle_data = del_res.rows[0];
          const { player1_name, player2_name } = battle_data;
          if (player1_name === ws_origin || player2_name === ws_origin) {
            client.send(
              JSON.stringify({
                title: "leave",
                msg: `player ${ws_origin} is leave, game is finished, you win!`,
              })
            );
          }
        });
      });
    });
    console.log("user disconnected");
  });
});

init();
