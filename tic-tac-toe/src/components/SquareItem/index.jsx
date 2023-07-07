import s from './index.module.css'

export const SquareItem = ({ symbol, acrossed }) =>
  <div className={ `${ s.item }` + " " + `${ acrossed ? s.acrossed : "" }` }>
    { symbol }
  </div>
