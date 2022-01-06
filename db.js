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
    // added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP <--- chyba niepotrzebne
    `,
  fines: `
    userId INT,
    username TEXT,
    reason TEXT,
    description TEXT,
    "from" TIMESTAMP,
    // "to" TIMESTAMP <--- chyba niepotrzebne
    `,
  finesReasons: `
    userId INT,
    name TEXT
    `,
  arrest: `
  userId INT,
  username TEXT,
  reason TEXT,
  description TEXT,
  "from" TIMESTAMP,
  "to" TIMESTAMP
  `,
  arrestReasons: `
    userId INT,
    name TEXT
  `
};
function createAllTables ( tablename, query )
{
  query = `CREATE TABLE IF NOT EXISTS ${ tablename } (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ${ query });`
  db.run( query, [], err =>
  {
    if ( err )
      return console.error( `Tabela ${ tablename } nie została stworzona` );
    return console.error( `Tabela ${ tablename } została stworzona` );

  } );
}
function toJSON ( object = {}, lines = 2 )
{
  return JSON.stringify( object, null, lines );
}
// for ( const table in tables )
// {
//   createAllTables( table, tables[ table ] );
// }
module.exports = { db, tables, queries, toJSON };

