import x_icon from '../../assets/game/x.svg'
import zero_icon from '../../assets/game/zero.svg'
import x_cross_icon from '../../assets/game/x_cross.svg'
import zero_cross_icon from '../../assets/game/zero_cross.svg'
import s from './index.module.css'

export const SquareItem = ({ id, symbol, acrossed, onClick }) =>
  <div
    className={`
      ${ s.item }
      ${ symbol === null ? s.false_hover : s.true_hover }
    `}
    onClick={ () => onClick(id, symbol !== null) }
  >
   { symbol && <img src={ acrossed ? symbol === "o" ? zero_cross_icon : x_cross_icon : symbol === "o" ? zero_icon : x_icon } /> }
  </div>
