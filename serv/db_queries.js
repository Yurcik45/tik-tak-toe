const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env['USER'],
  password: process.env['PASSWORD'],
  database: process.env['DATABASE'],
  host: process.env['HOST'],
  port: 5432, // default PostgreSQL port
});

const db_connect = () => {
  pool.connect((err, client, done) => {
    if (err) return console.error('Error acquiring client', err.stack)
    console.log('Connected to PostgreSQL database')
    fs.readFile('./tables.sql', 'utf8', (err, data) => {
      if (err) return console.error('Error reading SQL file', err.stack)
      const createTables = data
      client.query(createTables, (err, result) => {
        done(); // release the client back to the pool
        if (err) return console.error('Error executing query', err.stack)
        console.log('Tables created successfully')
      })
    })
  })
}

module.exports = { db_connect }
