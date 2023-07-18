import { v4 as uuid } from 'uuid'
import { ButtlesItem } from '../ButtlesItem'
import s from './index.module.css'
import b from '../buttles.module.css'

export const ButtlesList = ({ battles_data, onStart, notify, send_want_to_connect }) =>
{
	const origin = window.location.origin

	const generate_action = battle =>
	{
		if (battle.game_status === "search opponent" && battle.player1_name === origin) return {
			action: "waiting",
			onClick: () => notify("info", "wait to somebody connect")
		}
		if (battle.game_status === "search opponent") return {
			action: "connect",
			onClick: send_want_to_connect
		}
	}

	const NoBattle = () =>
	<div className={ s.container }>
		<div className={ s.text }>No buttles found, you can init first!</div>
		<button className={ s.button } onClick={onStart}>Send request</button>
	</div>


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
							{ ...{ ...battle, ...generate_action(battle) } }
						/>)
					: <NoBattle />
			}
		</div>
	)
}
