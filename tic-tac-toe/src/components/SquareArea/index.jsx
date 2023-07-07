import { SquareItem } from '../SquareItem'
import s from './index.module.css'

export const SquareArea = () =>
{
  const item = { symbol: null, acrossed: false }
  const items = Array(9).fill(item)

  return (
    <div className={ s.area }>
      { items.map((el, id) => <SquareItem  key={id} { ...el } />) }
    </div>
  )
}