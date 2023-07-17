import { v4 as uuid } from 'uuid'
import { useEffect } from 'react'
import { SquareItem } from '../SquareItem'
import s from './index.module.css'

export const SquareArea = ({ game_data, set_game_part, make_step, symbol, send_finish_game, notify }) =>
{
  const item_click = (item_id, is_symbol) =>
  {
    if (is_symbol && game_data[item_id].symbol !== symbol) return notify("warning", "That's you opponent square!")
    if (is_symbol && game_data[item_id].symbol === symbol) return notify("info", "You can't select it twice")
    make_step(game_data.map((item, id) => item_id === id ? ({ ...item, symbol }) : item ))
  }

  const check_winner = () =>
  {
    // horizontal
    if (game_data[1].symbol !== null && game_data[0].symbol === game_data[1].symbol && game_data[1].symbol === game_data[2].symbol ) return [0,1,2]
    if (game_data[4].symbol !== null && game_data[3].symbol === game_data[4].symbol && game_data[4].symbol === game_data[5].symbol ) return [3,4,5]
    if (game_data[7].symbol !== null && game_data[6].symbol === game_data[7].symbol && game_data[7].symbol === game_data[8].symbol ) return [6,7,8]
    // vertical
    if (game_data[3].symbol !== null && game_data[0].symbol === game_data[3].symbol && game_data[3].symbol === game_data[6].symbol ) return [0,3,6]
    if (game_data[4].symbol !== null && game_data[1].symbol === game_data[4].symbol && game_data[4].symbol === game_data[7].symbol ) return [1,4,7]
    if (game_data[5].symbol !== null && game_data[2].symbol === game_data[5].symbol && game_data[5].symbol === game_data[8].symbol ) return [2,5,8]
    // across
    if (game_data[4].symbol !== null && game_data[0].symbol === game_data[4].symbol && game_data[4].symbol === game_data[8].symbol ) return [0,4,8]
    if (game_data[4].symbol !== null && game_data[2].symbol === game_data[4].symbol && game_data[4].symbol === game_data[6].symbol ) return [2,4,6]
    return []
  }

  const check_acrossed = () =>
  {
    const steps_count = game_data.filter(item => item.symbol !== null).length
    if (steps_count < 5) return
    const winner_ids = check_winner()
    if (winner_ids.length === 0) return
    notify("success", "winner is: ", game_data[winner_ids[0]].symbol)
    const battle_accrossed = game_data.map(battle => winner_ids.indexOf(battle.id) !== -1 ? ({ ...battle, accrossed: true }) : battle)
    send_finish_game(battle_accrossed)
    // set_game_part("finish")
  }

  useEffect(check_acrossed, [game_data])

  return (
    <div className={ s.screen }>
      <div className={ s.label }>tic tac toe</div>   
      <div className={ s.area }>
        { game_data.map((item, id) => <SquareItem  key={ uuid() } id={ id } { ...item } onClick={ item_click } />) }
      </div>
      <button className={ s.button } onClick={() => { set_game_part("init") }}>exit</button>
    </div>
  )
}
