import s from './index.module.css'

export const SquareItem = ({ id, symbol, acrossed, onClick }) =>
  <div
    className={ `${ s.item }` + " " + `${ acrossed ? s.acrossed : "" }` }
    onClick={ () => onClick(id, symbol !== null) }
  >
    { symbol }
  </div>
