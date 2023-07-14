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
  const [battle_data, set_battle_data] = useState(null)
  const [block_step, set_block_step] = useState(false)
  const [is_it_first_player, set_is_it_first_player] = useState(null)
  const [battle_id, set_battle_id] = useState(null)
  const [symbol, set_symbol] = useState(null)

  console.group("=== App states ===")
  console.log("game_part: ", game_part)
  console.log({ block_step, is_it_first_player, battle_id, symbol })
  console.log("battle_data: ", battle_data)
  console.log("battleS_data: ", battles_data)
  console.groupEnd()

  const get_battles = async () =>
  {
    const battles = await get_all_battles()
		battles && set_battles_data(battles)
    return battles
  }

  myWs.onopen = () => { console.log('connected to WS') }
  myWs.onmessage = msg => ws_message_handler(JSON.parse(msg.data))

  const ws_message_handler = message =>
  {
    console.log("=== ws_message_handler ===", message)
    const { title } = message
    switch (title) {
      case "created": get_battles(); break;
      case "connected":
        set_game_part("start")
        set_battle_data(message.battle)
        break
      case "step": setup_particular_battle_info(message.battle); break;
      case "hello": console.log(message); break;
      case "test": console.log(message); break;
      default: console.log("no messages yet"); break;
    }
  }

  const send_want_to_start = async () =>
  {
    myWs.send(JSON.stringify({ title: "start" }))
  }

  const send_want_to_connect = battle_id =>
  {
    myWs.send(JSON.stringify({ title: "connect", id: battle_id, player2_name: window.location.origin }))
  }

  const setup_particular_battle_info = battle =>
  {
    const { id, last_step_player, player1_name, player1_symbol, player2_symbol, game_data } = battle
    set_battle_id(id)
    set_block_step(last_step_player === origin)
    const is_it_player1 = player1_name === origin
    set_is_it_first_player(is_it_player1)
    set_symbol(is_it_player1 ? player1_symbol : player2_symbol)
    set_battle_data(game_data)
  }

  const check_player_already_have_game = battles =>
  {
    const origin = window.location.origin
    const filtered = (battles ?? battles_data).filter(battle => battle.player1_name === origin || battle.player2_name === origin)
    if (filtered.length === 0) return false
    setup_particular_battle_info(filtered[0])
    return true
  }

  const make_step = data =>
  {
    console.log("battle data in make step", data)
    myWs.send(JSON.stringify({ title: "step", player: window.location.origin, data, battle_id }))
  }

  useEffect(() =>
  {
    if (game_part === "list")
    {
      get_battles().then(battles => check_player_already_have_game(battles) && set_game_part("start"))
    }
  }, [game_part])

  return (
    <div className="App">
      { game_part === "init" && <InfoScreen
          label="tic tac toe online"
          actions={[{
            action: () => set_game_part("list"),
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
          battle_data={battle_data}
          set_game_part={ set_game_part }
          make_step={make_step}
          symbol={symbol}
        />
      }
    </div>
  )
}
