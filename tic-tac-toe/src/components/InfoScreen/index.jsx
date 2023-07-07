import s from './index.module.css'

export const InfoScreen = ({ label, action_label = null, action = null, background }) =>
  <div className={ `${ s.screen }` + " " + `${ background ? s[background] : s.default_bg }` }>
    <div className={ s.label }>{ label }</div>
    { action_label && action && <button className={ s.button } onClick={ action }>{ action_label }</button> }
  </div>
