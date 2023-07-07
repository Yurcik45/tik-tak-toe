import { useEffect, useState } from 'react'
import { SquareItem } from '../SquareItem'
import s from './index.module.css'

export const SquareArea = () =>
{
  const items_initial = Array(9).fill({ symbol: null, acrossed: false })
  const [items, set_items] = useState(items_initial)
  const [is_finish, set_is_finish] = useState(false)

  // [ { symbol: null, acrossed: false }, { symbol: null, acrossed: false }, { symbol: null, acrossed: false },
  //   { symbol: null, acrossed: false }, { symbol: null, acrossed: false }, { symbol: null, acrossed: false },
  //   { symbol: null, acrossed: false }, { symbol: null, acrossed: false }, { symbol: null, acrossed: false }, ]

  // 0  1  2
  // 3  4  5
  // 6  7  8

  const item_click = (item_id, is_symbol) =>
  {
    if (is_symbol) return console.log("You can't select it twice")
    set_items(items.map((item, id) => item_id === id ? ({ ...item, symbol: "x" }) : item ))
  }

  const check_winner = (symbol) =>
  {
    // horizontal
    if (items[0].symbol === symbol && items[1].symbol === symbol && items[2].symbol === symbol ) return { status: true, ids: [0,1,2], mode: "horizontal" }
    if (items[3].symbol === symbol && items[4].symbol === symbol && items[5].symbol === symbol ) return { status: true, ids: [3,4,5], mode: "horizontal" }
    if (items[6].symbol === symbol && items[7].symbol === symbol && items[8].symbol === symbol ) return { status: true, ids: [6,7,8], mode: "horizontal" }
    // vertical
    if (items[0].symbol === symbol && items[3].symbol === symbol && items[6].symbol === symbol ) return { status: true, ids: [0,3,6], mode: "vertical" }
    if (items[1].symbol === symbol && items[4].symbol === symbol && items[7].symbol === symbol ) return { status: true, ids: [1,4,7], mode: "vertical" }
    if (items[2].symbol === symbol && items[5].symbol === symbol && items[8].symbol === symbol ) return { status: true, ids: [2,5,8], mode: "vertical" }
    // across
    if (items[0].symbol === symbol && items[4].symbol === symbol && items[8].symbol === symbol ) return { status: true, ids: [0,4,8], mode: "across" }
    if (items[2].symbol === symbol && items[4].symbol === symbol && items[6].symbol === symbol ) return { status: true, ids: [1,4,7], mode: "across_reverse" }
    return { status: false, ids: [], mode: null }
  }

  const check_acrossed = () =>
  {
    const steps_count = items.filter(item => item.symbol !== null).length
    if (steps_count < 5) return console.log("too early for find the winner")
    console.log("find the winner logic ..")
    const result = check_winner("x") 
    console.log("result: ", result)
    if (result.status) set_is_finish(true)
  }

  const restart_game = () =>
  {
    set_is_finish(false)
  }

  console.log("items", items)

  useEffect(check_acrossed, [items])

  return (
    <div className={ s.area }>
      { !is_finish
          ? items.map((item, id) => <SquareItem  key={id} { ...{ id, ...item } } onClick={ item_click } />)
          : <div onClick={ restart_game }>One more time?</div>
        }
    </div>
  )
}