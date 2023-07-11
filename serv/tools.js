// HOC for error handling
const db_err_handling_hoc = func =>
{
  return async (...args) => {
    try {
      const result = await func(...args);
      return result;
    } 
    catch (err) { console.error('Error:', err) }
  }
}

const log_battle_rows = result =>
{
  // Extract rows and remove PostgreSQL technical information
  const rows = result.rows.map((row) => ({ ...row }));
  console.table(rows);
}

const game_query_builder = ({...params}) =>
({
  get_all: 'SELECT * FROM battles',
  get_one: `SELECT * FROM battles WHERE id=${params.id}`,
  create: `
    INSERT INTO battles (player1_name, game_status)
    VALUES ('${params.player1_name}', 'search opponent')
    RETURNING *
  `,
  start: `
    UPDATE battles
    SET player2_name='${params.player2_name}', is_player2_online=true, game_status='running'
    WHERE id=${params.id}
    RETURNING *
  `,
  update_status: `
    UPDATE battles
    SET is_player1_online=${params.is_player1_online}, is_player2_online=${params.is_player2_online}, game_status='${params.game_status}'
    WHERE id=${params.id}
    RETURNING *
  `,
  update_data: `
    UPDATE battles
    SET game_data='${JSON.stringify(params.game_data)}'
    WHERE id=${params.id}
    RETURNING *
  `,
  delete: `
    DELETE FROM battles
    WHERE id=${params.id}
    RETURNING *
  `
})

module.exports = {
  db_err_handling_hoc,
  log_battle_rows,
  game_query_builder,
}