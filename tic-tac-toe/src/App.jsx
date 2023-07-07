import { useState } from 'react'
import './App.css'
import { InfoScreen } from './components/InfoScreen'
import { SquareArea } from './components/SquareArea'

export const App = () =>
{
  const [game_part, set_game_part] = useState("init") // "start" "finish" "error"

  return (
    <div className="App">
      { game_part !== "start" && <InfoScreen
        label={ game_part === "error" ? "something went wrong :(" : game_part == "init" ? "tic tac toe online" : "one more time?" }
        action={() => { game_part === "error" ? window.navigation.reload() : set_game_part("start") }}
        action_label={ game_part === "error" ? "reset game" : game_part == "init" ? "start game" : "restart game" }
        background={ game_part === "error" ? "bg2" : game_part === "init" ? "bg1" : null }
      /> }
      { game_part === "start" && <SquareArea set_game_part={ set_game_part } /> }
    </div>
  )
}

// const myWs = new WebSocket('ws://localhost:9000')
// myWs.onopen = () => { console.log('connected') }
// myWs.onmessage = (message) => { console.log('Message: ', message) }
// const wsSend = () => { console.log("trying to send the message"); myWs.send(JSON.stringify("message from website")) }