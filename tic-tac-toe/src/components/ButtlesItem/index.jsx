import s from './index.module.css'
import b from '../buttles.module.css'

export const ButtlesItem = ({ id, player1_name, player2_name, game_status, action, send_want_to_connect }) =>
	<div className={ s.item } onClick={() => send_want_to_connect(id)}>
		<div className={ b.id + " " + s.id }>{ id }</div>
		<div className={ b.name + " " + s.name }>{ player1_name ?? "empty" }</div>
		<div className={ b.name + " " + s.name }>{ player2_name ?? "empty" }</div>
		<div className={ b.status + " " + s.status }>{ game_status }</div>
		<div className={ b.action + " " + s[action] }>
			{ action }
		</div>
	</div>
