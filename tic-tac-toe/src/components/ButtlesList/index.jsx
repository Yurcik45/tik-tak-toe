import { ButtlesItem } from '../ButtlesItem'
import s from './index.module.css'
import b from '../buttles.module.css'

export const ButtlesList = () =>
{
	const buttles = [
		{
			id: 5,
			player1_name: "pl1",
			is_player1_online: true,
			player2_name: "pl2",
			is_player2_online: false,
			game_status: "search opponent", // "search opponent" "running" "finished"
		},
		{
			id: 6,
			player1_name: "pl11",
			is_player1_online: true,
			player2_name: "pl22",
			is_player2_online: true,
			game_status: "running",
		},
		{
			id: 7,
			player1_name: "pl111",
			is_player1_online: true,
			player2_name: "pl222",
			is_player2_online: true,
			game_status: "finished",
		},
	]

	const generate_action = buttle =>
	{
		if (buttle.game_status === "running") return "watch"
		if (!buttle.is_player1_online || !buttle.is_player2_online) return "connect"
		if (buttle.game_status === "search opponent") return "connect"
		if (buttle.game_status === "finished") return "result"
		return "no actions"
	}

	return (
		<div className={ s.list }>
			<div className={ s.header }>
				<div className={ b.id + " " + s.id }>id</div>
				<div className={ b.name + " " + s.name }>player 1 name</div>
				<div className={ b.online + " " + s.online }>online</div>
				<div className={ b.name + " " + s.name }>player 2 name</div>
				<div className={ b.online  + " " + s.online }>online</div>
				<div className={ b.status + " " + s.status }>game status</div>
				<div className={ b.status + " " + s.status }>action</div>
			</div>
			{ buttles.length > 0
			  	? buttles.map(buttle => <ButtlesItem key={ buttle.id } { ...{ ...buttle, action: generate_action(buttle) } } />)
					: <div className={ s.no_buttle }>No buttles found, you can init first!</div>
			}
		</div>
	)
}
