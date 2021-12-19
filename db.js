const sqlite3 = require( "sqlite3" ).verbose();
const db = new sqlite3.Database( 'DataBase.db', sqlite3.OPEN_READWRITE, ( err ) =>
{
  if ( err )
  {
    return console.error( err.message );
  }
  console.log( 'Connected to the SQlite database.' );
} );
const query = {
  run: function ( query )
  {
    db.run( query, ( err ) =>
    {
      if ( err )
      {
        console.log( err )
      } else
      {
        console.log( "done!" )
      }
    } )
  }
};
const tables = {
  users: `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    fullname TEXT,
    age INT,
    birth_date TIMESTAMP,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`
};
query.run( "DROP TABLE users;" );
query.run( tables.users );
query.run( `INSERT INTO users (first_name,lsat_name,fullname,age,birth_date,added_date) VALUES ("Wojciech","Wojtyczka","Wojciech Wojtyczka",21,"2000-25-04");` );
module.exports = { db };
