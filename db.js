const sqlite3 = require( "sqlite3" ).verbose();
const db = new sqlite3.Database( 'DataBase.db', sqlite3.OPEN_READWRITE, ( err ) =>
{
  if ( err )
  {
    return console.error( err.message );
  }
} );
const query = {
  select: function select ( query, params = [] )
  {
    if ( params instanceof Array !== true )
      params = [ params ];
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
  }
};
const queries = {
  userAdd: `INSERT INTO users (first_name,last_name,fullname,age,birth_date) VALUES (?,?,?,?,?)`,
}
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

module.exports = { db, query, tables, queries };
