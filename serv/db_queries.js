const fs = require('fs');
const { Pool } = require('pg');

const db_connect = async () =>
{
  const pool = new Pool({
    user: process.env['USER'],
    password: process.env['PASSWORD'],
    database: process.env['DATABASE'],
    host: process.env['HOST'],
    port: 5432, // default PostgreSQL port
  });

  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    return {
      client,
      done: () => {
        client.release();
        console.log('Client released back to the pool');
      }
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    throw err; // Rethrow the error to be caught by the calling code
  }
}

const db_init = async () =>
{
  const {client, done} = await db_connect()
  fs.readFile('./tables.sql', 'utf8', (err, data) => {
    if (err) return console.error('Error reading SQL file', err.stack)
    const createTables = data
    client.query(createTables, (err, result) => {
      done(); // release the client back to the pool
      if (err) return console.error('Error executing query', err.stack)
      console.log('Tables created successfully')
    })
  })
}

// const create_buttle = () =>
// {

// }

module.exports = { db_init }
