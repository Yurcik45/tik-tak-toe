const fs = require('fs')
const { Pool } = require('pg')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)
const {  db_err_handling_hoc, log_battle_rows, game_query_builder } = require('./tools')

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

const execute_query = async query =>
{
  const { client, done } = await db_connect();
  const result = await client.query(query);
  // log_battle_rows(result)
  done();
  return result
}

const execute_query_safety = db_err_handling_hoc(execute_query)

const make_query = async (query_type = "get_all", params = {}, castom = false, castom_query = "") =>
{
  console.log("make_query", { query_type, params, castom, castom_query })
  const possible_query_types = Object.keys(game_query_builder({}))
  if (castom === false && possible_query_types.indexOf(query_type) === -1) return
  return await execute_query_safety(castom ? castom_query : game_query_builder(params)[query_type])
}

module.exports = {
  db_init,
  make_query,
}
