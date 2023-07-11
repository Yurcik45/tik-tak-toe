import { useEffect, useState } from 'react'
import './App.css'
import { InfoScreen } from './components/InfoScreen'
import { SquareArea } from './components/SquareArea'
import { ButtlesList } from './components/ButtlesList'
import { get_all_battles } from './requests'

const myWs = new WebSocket('ws://localhost:9000')

export const App = () =>
{
  const [game_part, set_game_part] = useState("init") // "list" "start" "finish" "error"
  const [battles_data, set_battles_data] = useState([])

  const get_battles = async () =>
  {
    const battles = await get_all_battles()
		battles && set_battles_data(battles)
  }

  myWs.onopen = () => { console.log('connected to WS') }
  myWs.onmessage = msg => ws_message_handler(JSON.parse(msg.data))

  const ws_message_handler = message =>
  {
    console.log("=== ws_message_handler ===", message)
    const { title, msg } = message
    switch (title) {
      case "created": get_battles(); break;
      case "hello": console.log(msg); break;
      case "test": console.log(msg); break;
      default: console.log("no messages yet"); break;
    }
  }

  const send_want_to_start = async () =>
  {
    myWs.send(JSON.stringify("start"))
  }

  useEffect(() =>
  {
    if (game_part === "list") get_battles()
  }, [game_part])

  return (
    <div className="App">
      { game_part !== "start" && game_part !== "list" && <InfoScreen
        label={ game_part === "error" ? "something went wrong :(" : game_part == "init" ? "tic tac toe online" : "one more time?" }
        action={() => { game_part === "error" ? window.navigation.reload() : set_game_part("list") }}
        action_label={ game_part === "error" ? "reset game" : game_part == "init" ? "start game" : "restart game" }
        background={ game_part === "error" ? "bg2" : game_part === "init" ? "bg1" : null }
      /> }
      { game_part === "list" && <ButtlesList battles_data={battles_data} onStart={send_want_to_start} /> }
      { game_part === "start" && <SquareArea set_game_part={ set_game_part } /> }
    </div>
  )
}
