import { v4 as uuid } from 'uuid'
import { ButtlesItem } from '../ButtlesItem'
import s from './index.module.css'
import b from '../buttles.module.css'

export const ButtlesList = ({ battles_data, onStart, send_want_to_connect }) =>
{
	const generate_action = buttle =>
	{
		if (buttle.game_status === "running") return "watch"
		if (buttle.game_status === "search opponent") return "connect"
		if (buttle.game_status === "finished") return "result"
		return "no actions"
	}

	const NoBattle = () =>
	<div className={ s.container }>
		<div className={ s.text }>No buttles found, you can init first!</div>
		<button className={ s.button } onClick={onStart}>Send request</button>
	</div>

	const origin = window.location.origin

	return (
		<div className={ s.list }>
			<div className={ s.header }>
				<div className={ b.id + " " + s.id }>id</div>
				<div className={ b.name + " " + s.name }>player 1 name</div>
				<div className={ b.name + " " + s.name }>player 2 name</div>
				<div className={ b.status + " " + s.status }>game status</div>
				<div className={ b.status + " " + s.status }>action</div>
			</div>
			{ battles_data.length > 0
			  	? battles_data.map(battle =>
						<ButtlesItem
							key={ uuid() }
							{ ...{ ...battle, action: generate_action(battle) } }
							send_want_to_connect={ origin === battle.player1_name || origin === battle.player2_name ? () => {} : send_want_to_connect}
						/>)
					: <NoBattle />
			}
		</div>
	)
}
