import { v4 as uuid } from 'uuid'
import s from './index.module.css'

export const InfoScreen = ({ label, actions = [], background }) =>
  <div className={ `${ s.screen }` + " " + `${ background ? s[background] : s.default_bg }` }>
    <div className={ s.label }>{ label }</div>
    { actions.length > 0 && actions.map(action =>
        action.label && action.action && <button key={ uuid() } className={ s.button } onClick={ action.action }>{ action.label }</button>
    )}
  </div>
