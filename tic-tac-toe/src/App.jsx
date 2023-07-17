import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InfoScreen } from './components/InfoScreen'
import { SquareArea } from './components/SquareArea'
import { ButtlesList } from './components/ButtlesList'
import { get_all_battles } from './requests'
import './App.css'

const myWs = new WebSocket('ws://192.168.88.76:9000')

export const App = () =>
{
  const [game_part, set_game_part] = useState("init") // "list" "start" "finish" "error"
  const [battles_data, set_battles_data] = useState([])
  const [battle_data, set_battle_data] = useState(null)

  const origin = window.location.origin

  const notify = (type = "info", msg = "Wow so easy!") => toast[type](msg)

  console.group("=== App states ===")
  console.log("game_part: ", game_part)
  console.log("battle_data: ", battle_data)
  console.log("battleS_data: ", battles_data)
  console.groupEnd()

  const get_battles = async () =>
  {
    const battles = await get_all_battles()
		battles && set_battles_data(battles)
    return battles
  }

  myWs.onopen = () => { console.log('connected to WS'); notify("success", "connected to game network") }
  myWs.onmessage = msg => ws_message_handler(JSON.parse(msg.data))
  myWs.onerror = err =>
  {
    console.warn("ws error", err)
    notify("error", "websocket connection error")
    set_game_part("error")
  }

  const ws_message_handler = message =>
  {
    console.log("=== ws_message_handler ===", message)
    const { title } = message
    switch (title) {
      case "game_created":
        if (game_part !== "list") break
        get_battles()
        break
      case "game_started":
        set_battle_data(message.battle_data)
        set_game_part("start")
        if (message.new_user_name !== origin) notify("success", `opponent ${message.new_user_name} connected`)
        break
    case "step": set_battle_data(message.battle); break;
    case "leave":
      get_battles()
      set_game_part("list")
      notify(message.msg)
      break
    default: console.warn("no messages yet"); break;
  }
}

  const send_want_to_start = async () =>
  {
    myWs.send(JSON.stringify({ title: "create_game" }))
    set_game_part("list")
  }

  const send_want_to_connect = battle_id =>
  {
    myWs.send(JSON.stringify({ title: "connect_to_battle", id: battle_id, player2_name: origin }))
  }

  const send_finish_game = updated_battle_data =>
  {
    myWs.send(JSON.stringify({ title: "finish_game", id: battle_data.id, game_data: updated_battle_data }))
  }

  const make_step = data =>
  {
    if (battle_data.last_step_player === origin) return notify("info", "it's not your turn now")
    console.log("battle data in make step", data)
    myWs.send(JSON.stringify({ title: "step", battle_data, game_data: data }))
  }

  return (
    <div className="App">
      { game_part === "init" && <InfoScreen
          label="tic tac toe online"
          actions={[{
            action: () => { set_game_part("list"); get_battles() },
            label: "start game"
          }]}
          background="bg1"
        />
      }
      { game_part === "finish" && <InfoScreen
          label="one more time?"
          actions={[
            {
              action: () => set_game_part("start"),
              label: "restart game"
            },
            {
              action: () => set_game_part("list"),
              label: "go to battles"
            },
            {
              action: () => set_game_part("init"),
              label: "exit"
            }
          ]}
        />
      }
      { game_part === "error" && <InfoScreen
          label="something went wrong :("
          actions={[{
            action: () => window.navigation.reload(),
            label: "reset game"
          }]}
          background="bg2"
        />
      }
      { game_part === "list" &&
        <ButtlesList
          battles_data={battles_data}
          onStart={send_want_to_start}
          send_want_to_connect={send_want_to_connect}
        />
      }
      { game_part === "start" && battle_data &&
        <SquareArea
          game_data={battle_data.game_data}
          set_game_part={ set_game_part }
          send_finish_game={ send_finish_game }
          make_step={make_step}
          notify={notify}
          symbol={battle_data.player1_name === origin ? battle_data.player1_symbol : battle_data.player2_symbol}
        />
      }
      <ToastContainer
        position="bottom-right" autoClose={5000} hideProgressBar={false}
        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss
        draggable pauseOnHover theme="light"
      />
    </div>
  )
}
