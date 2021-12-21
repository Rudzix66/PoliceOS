const sqlite3 = require( "sqlite3" ).verbose();
const db = new sqlite3.Database( "./DataBase.db", sqlite3.OPEN_READWRITE, err =>
{
  if ( err )
  {
    return console.error( err.message );
  }
  console.log( "Connected to database" )
} );

const queries = {
  userAdd: `INSERT INTO users (first_name,last_name,fullname,birth_date) VALUES (?,?,?,?);`,
}
const tables = {
  users: `
    first_name TEXT,
    last_name TEXT,
    fullname TEXT,
    birth_date TIMESTAMP,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `,
  fines: `
    username TEXT
    reason TEXT,
    description TEXT,
    "from" TIMESTAMP,
    "to" TIMESTAMP
    `,
  finesReasons: `
    name TEXT
    `,
  arrest: `
  username TEXT
  reason TEXT,
  description TEXT,
  "from" TIMESTAMP,
  "to" TIMESTAMP
  `,
  arrestReasons: `
    name TEXT
  `
};

function toJSON ( object = {}, lines = 2 )
{
  return JSON.stringify( object, null, lines );
}
module.exports = { db, tables, queries, toJSON };

