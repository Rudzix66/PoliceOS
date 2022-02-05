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
  userAdd: `INSERT INTO users (first_name,last_name,fullname,status,birth_date) VALUES (?,?,?,?,?);`,
}
const tables = {
  users: `
    first_name TEXT,
    last_name TEXT,
    fullname TEXT,
    status TEXT,
    birth_date TIMESTAMP,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    age INT,
    gender TEXT,
    stopped INT,
    suspension TEXT,
    parole: TEXT
    `,
  fines: `
    userId INT,
    name TEXT,
    reason TEXT,
    description TEXT
    `,
  finesReasons: `
    userId INT,
    name TEXT
    `,
  status: `
  name TEXT
  `,
  arrest: `
  userId INT,
  name TEXT,
  reason TEXT,
  description TEXT
  `,
  arrestReasons: `
    userId INT,
    name TEXT
  `,
  notes: `
  userId INT,
  description TEXT,
  reason TEXT,
  name TEXT`
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
// removeDb( [ "fines", "arrest", "notes" ] );

function removeDb ( name = "" )
{
  if ( Array.isArray( name ) )
  {
    for ( const nameDb of name )
    {
      db.all( `DROP TABLE ${ nameDb };`, ( err ) =>
      {
        if ( err )
          console.log( err );
        else
          console.log( `usunięto ${ nameDb }` );
      } )
    }
  } else
  {
    db.all( `DROP TABLE ${ name };`, ( err ) =>
    {
      if ( err )
        console.log( err );
      else
        console.log( `usunięto ${ name }` );
    } )
  }
}
// db.all( "INSERT INTO notes (userId,name,description,name) VALUES (3,'test','test','test')" )
// for ( const table in tables )
// {
//   createAllTables( table, tables[ table ] );
// }
module.exports = { db, tables, queries, toJSON };

