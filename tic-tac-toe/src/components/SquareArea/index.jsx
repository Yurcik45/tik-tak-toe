import { useEffect, useState } from 'react'
import { SquareItem } from '../SquareItem'
import s from './index.module.css'

export const SquareArea = ({ set_game_part }) =>
{
  const [items, set_items] = useState(Array(9).fill({ symbol: null, acrossed: false }))

  const item_click = (item_id, is_symbol) =>
  {
    if (is_symbol) return console.log("You can't select it twice")
    set_items(items.map((item, id) => item_id === id ? ({ ...item, symbol: "x" }) : item ))
  }

  const check_winner = () =>
  {
    // horizontal
    if (items[1].symbol !== null && items[0].symbol === items[1].symbol && items[1].symbol === items[2].symbol ) return { status: true, ids: [0,1,2], mode: "horizontal" }
    if (items[4].symbol !== null && items[3].symbol === items[4].symbol && items[4].symbol === items[5].symbol ) return { status: true, ids: [3,4,5], mode: "horizontal" }
    if (items[7].symbol !== null && items[6].symbol === items[7].symbol && items[7].symbol === items[8].symbol ) return { status: true, ids: [6,7,8], mode: "horizontal" }
    // vertical
    if (items[3].symbol !== null && items[0].symbol === items[3].symbol && items[3].symbol === items[6].symbol ) return { status: true, ids: [0,3,6], mode: "vertical" }
    if (items[4].symbol !== null && items[1].symbol === items[4].symbol && items[4].symbol === items[7].symbol ) return { status: true, ids: [1,4,7], mode: "vertical" }
    if (items[5].symbol !== null && items[2].symbol === items[5].symbol && items[5].symbol === items[8].symbol ) return { status: true, ids: [2,5,8], mode: "vertical" }
    // across
    if (items[4].symbol !== null && items[0].symbol === items[4].symbol && items[4].symbol === items[8].symbol ) return { status: true, ids: [0,4,8], mode: "across" }
    if (items[4].symbol !== null && items[2].symbol === items[4].symbol && items[4].symbol === items[6].symbol ) return { status: true, ids: [2,4,6], mode: "across_reverse" }
    return { status: false, ids: [], mode: null }
  }

  const check_acrossed = () =>
  {
    const steps_count = items.filter(item => item.symbol !== null).length
    if (steps_count < 5) return
    const result = check_winner()
    if (result.status)
    {
      console.log("winner is: ", items[result.ids[0]].symbol)
      set_game_part("finish")
    }
  }

  useEffect(check_acrossed, [items])

  return (
    <div className={ s.screen }>
      <div className={ s.label }>tic tac toe</div>   
      <div className={ s.area }>
        { items.map((item, id) => <SquareItem  key={id} { ...{ id, ...item } } onClick={ item_click } />) }
      </div>
      <button className={ s.button } onClick={() => { set_game_part("init") }}>exit</button>
    </div>
  )
}