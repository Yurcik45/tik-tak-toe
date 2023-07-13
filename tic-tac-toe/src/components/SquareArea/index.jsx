import { v4 as uuid } from 'uuid'
import { useEffect, useState } from 'react'
import { SquareItem } from '../SquareItem'
import s from './index.module.css'

export const SquareArea = ({ battle_data, set_game_part, make_step, symbol }) =>
{
  const item_click = (item_id, is_symbol) =>
  {
    if (is_symbol && battle_data[item_id].symbol !== symbol) return console.log("That's you opponent square!")
    if (is_symbol && battle_data[item_id].symbol === symbol) return console.log("You can't select it twice")
    const updated_items = battle_data.map((item, id) => item_id === id ? ({ ...item, symbol }) : item )
    // set_items(updated_items)
    // console.log({ symbol, item_id, updated_items })
    make_step(updated_items)
  }

  const check_winner = () =>
  {
    // horizontal
    if (battle_data[1].symbol !== null && battle_data[0].symbol === battle_data[1].symbol && battle_data[1].symbol === battle_data[2].symbol ) return { status: true, ids: [0,1,2], mode: "horizontal" }
    if (battle_data[4].symbol !== null && battle_data[3].symbol === battle_data[4].symbol && battle_data[4].symbol === battle_data[5].symbol ) return { status: true, ids: [3,4,5], mode: "horizontal" }
    if (battle_data[7].symbol !== null && battle_data[6].symbol === battle_data[7].symbol && battle_data[7].symbol === battle_data[8].symbol ) return { status: true, ids: [6,7,8], mode: "horizontal" }
    // vertical
    if (battle_data[3].symbol !== null && battle_data[0].symbol === battle_data[3].symbol && battle_data[3].symbol === battle_data[6].symbol ) return { status: true, ids: [0,3,6], mode: "vertical" }
    if (battle_data[4].symbol !== null && battle_data[1].symbol === battle_data[4].symbol && battle_data[4].symbol === battle_data[7].symbol ) return { status: true, ids: [1,4,7], mode: "vertical" }
    if (battle_data[5].symbol !== null && battle_data[2].symbol === battle_data[5].symbol && battle_data[5].symbol === battle_data[8].symbol ) return { status: true, ids: [2,5,8], mode: "vertical" }
    // across
    if (battle_data[4].symbol !== null && battle_data[0].symbol === battle_data[4].symbol && battle_data[4].symbol === battle_data[8].symbol ) return { status: true, ids: [0,4,8], mode: "across" }
    if (battle_data[4].symbol !== null && battle_data[2].symbol === battle_data[4].symbol && battle_data[4].symbol === battle_data[6].symbol ) return { status: true, ids: [2,4,6], mode: "across_reverse" }
    return { status: false, ids: [], mode: null }
  }

  const check_acrossed = () =>
  {
    const steps_count = battle_data.filter(item => item.symbol !== null).length
    if (steps_count < 5) return
    const result = check_winner()
    if (result.status)
    {
      console.log("winner is: ", battle_data[result.ids[0]].symbol)
      set_game_part("finish")
    }
  }

  useEffect(check_acrossed, [battle_data])

  return (
    <div className={ s.screen }>
      <div className={ s.label }>tic tac toe</div>   
      <div className={ s.area }>
        { battle_data.map((item, id) => <SquareItem  key={ uuid() } id={ id } { ...item } onClick={ item_click } />) }
      </div>
      <button className={ s.button } onClick={() => { set_game_part("init") }}>exit</button>
    </div>
  )
}
