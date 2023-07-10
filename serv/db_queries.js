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

const make_db_query = (query) => db_err_handling_hoc(async func =>
{
  const { client, done } = await db_connect()
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

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

const get_all_battles = db_err_handling_hoc(async () =>
{
  const { client, done } = await db_connect()
  const guery = 'SELECT * FROM battles'
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

const get_one_battle = db_err_handling_hoc(async (id) =>
{
  console.log("getting battle with id", id)
  const { client, done } = await db_connect()
  const guery = `SELECT * FROM battles WHERE id=${id}`
  console.log("before results", guery)
  const result = await client.query(guery)
  console.log("after results")
  console.log('Rows:', result.rows)
  done()
})

const create_battle = db_err_handling_hoc(async (player1_name) =>
{
  const { client, done } = await db_connect()
  const guery = `
    INSERT INTO battles (player1_name, game_status)
    VALUES ('${player1_name}', 'search opponent')
    RETURNING *
  `
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

const start_battle = db_err_handling_hoc(async (id, player2_name) =>
{
  const { client, done } = await db_connect()
  const guery = `
    UPDATE battles
    SET player2_name='${player2_name}', is_player2_online=true, game_status='running'
    WHERE id=${id}
    RETURNING *
  `
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

const patch_battle_status = db_err_handling_hoc(async (id, is_player1_online, is_player2_online, game_status) =>
{
  const { client, done } = await db_connect()
  const guery = `
    UPDATE battles
    SET is_player1_online=${is_player1_online}, is_player2_online=${is_player2_online}, game_status='${game_status}'
    WHERE id=${id}
    RETURNING *
  `
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

const patch_battle_data = db_err_handling_hoc(async (id, game_data) =>
{
  const { client, done } = await db_connect()
  const guery = `
    UPDATE battles
    SET game_data='${JSON.stringify(game_data)}'
    WHERE id=${id}
    RETURNING *
  `
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

const delete_battle = db_err_handling_hoc(async (id) =>
{
  const { client, done } = await db_connect()
  const guery = `
    DELETE FROM battles
    WHERE id=${id}
    RETURNING *
  `
  const result = await client.query(guery)
  console.log('Rows:', result.rows)
  done()
})

module.exports = {
  db_init,
  get_all_battles,
  get_one_battle,
  create_battle,
  start_battle,
  patch_battle_status,
  patch_battle_data,
  delete_battle,
}
