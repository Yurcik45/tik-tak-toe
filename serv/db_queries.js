const fs = require('fs')
const { Pool } = require('pg')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)

// HOC for error handling
const db_err_handling_hoc = func =>
{
  return async (...args) => {
    try { await func(...args) } 
    catch (err) { console.error('Error:', err) }
  }
}

const db_connect = async () =>
{
  const pool = new Pool({
    user: process.env['USER'],
    password: process.env['PASSWORD'],
    database: process.env['DATABASE'],
    host: process.env['HOST'],
    port: 5432, // default PostgreSQL port
  })

  try {
    const client = await pool.connect()
    console.log('Connected to PostgreSQL database')
    return {
      client,
      done: () => {
        client.release()
        console.log('Client released back to the pool')
      }
    }
  } catch (err) {
    console.error('Error connecting to database', err)
    throw err // Rethrow the error to be caught by the calling code
  }
}

const db_init = db_err_handling_hoc(async () =>
{
  const data = await readFileAsync('./tables.sql', 'utf8')
  const createTables = data

  const { client, done } = await db_connect()
  await client.query(createTables)
  console.log('Tables created successfully')
  done()
})

const log_battle_rows = result =>
{
  // Extract rows and remove PostgreSQL technical information
  const rows = result.rows.map((row) => {
    const { id, player1_name, is_player1_online, player2_name, is_player2_online, game_status, game_data } = row;
    return { id, player1_name, is_player1_online, player2_name, is_player2_online, game_status, game_data };
  });

  console.table(rows);
}

const execute_query = async query =>
{
  const { client, done } = await db_connect();
  const result = await client.query(query);
  log_battle_rows(result)
  done();
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

const execute_query_safety = db_err_handling_hoc(execute_query)

const make_query = (query_type = "get_all", params = {}, custom = false, custom_query = "") =>
{
  console.log({ query_type, result_query: game_query_builder(params)[query_type]})
  return execute_query_safety(custom ? custom_query : game_query_builder(params)[query_type])
}

module.exports = {
  db_init,
  make_query,
}
