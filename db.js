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
  },
  select: function ( query, params = [] )
  {
    if ( params instanceof Array !== true )
      params = [ params ];
    let data = null;
    db.all( query, params, ( err, rows ) =>
    {
      if ( err )
      {
        console.log( err );
        return null;
      } else
      {
        return data = rows;
      }
    } );
    return data;
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

module.exports = { db, query, tables };
