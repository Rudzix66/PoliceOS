const express = require( "express" );
const sqlite3 = require( "./db" );
const db = sqlite3.db;
const queries = sqlite3.queries;
const tables = sqlite3.tables;
const toJSON = sqlite3.toJSON;
const code = { 400: { code: 400 }, 200: { code: 200 } };
const app = express();
const port = 3000;

app.use( express.urlencoded( { extended: true } ) )
app.set( "view engine", "ejs" );
app.use( express.static( __dirname + "/views" ) );
app.use( express.json() )

app.get( "/", ( req, res ) =>
{
  console.log( "--> /" );
  res.render( "index" );
} );

app.get( "/users/:id", ( req, res ) =>
{
  const id = parseInt( req.params.id );
  if ( req.params.id === "*" )
  {
    db.all( "SELECT * FROM users;", [], ( err, rows ) =>
    {
      if ( rows )
      {
        const response = code[ "200" ];
        response.data = rows;
        return res.send( toJSON( response ) );
      }
      return res.send( toJSON( code[ "400" ] ) );
    } );
  } else
  {
    db.get( "SELECT * FROM users WHERE id = ?;", [ id ], ( err, row ) =>
    {
      if ( row )
      {
        const response = code[ "200" ];
        response.data = row;
        return res.send( toJSON( response ) );
      }
      return res.send( toJSON( code[ "400" ] ) );
    } );
  }
} );

app.post( "/users", ( req, res ) =>
{
  const data = req.body;
  const action = data.action;
  if ( !action )
    return res.send( toJSON( code[ "400" ] ) );

  if ( action === "add" )
  {
    const first_name = data.first_name.trim();
    const last_name = data.last_name.trim();
    const fullname = `${ first_name } ${ last_name }`;
    let birth_date = data.birth_date.trim();
    const date = new Date( birth_date );
    if ( !first_name || !last_name || !birth_date || isNaN( date.getTime() ) )
      return res.send( toJSON( code[ "400" ] ) );
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${ date.getMonth() + 1 }` : date.getMonth;
    const day = date.getDate() < 10 ? `0${ date.getDate() }` : date.getDate();
    birth_date = `${ year }-${ month }-${ day }`;
    db.run( queries.userAdd, [ first_name, last_name, fullname, birth_date ], function ( err )
    {
      if ( err )
      {
        return res.send( toJSON( code[ "400" ] ) );
      } else
      {
        const response = code[ "200" ];
        response.id = this.lastID;
        return res.send( toJSON( response ) );
      }
    } )
  } else if ( action === "update" )
  {
    const id = parseInt( data.id );
    const name = data.name.trim();
    const value = data.value.trim();
    const available = [ "first_name", "last_name", "birth_date" ]
    if ( ( !id || !name || !value ) || ( !available.indexOf( value ) ) )
      return res.send( toJSON( code[ "400" ] ) );
    db.run( `UPDATE users SET ${ name } = ? WHERE id = ?`, [ value, id ], function ( err )
    {
      if ( err )
      {
        return res.send( toJSON( code[ "400" ] ) );
      } else
      {
        if ( name === "first_name" || name === "last_name" )
        {
          db.get( `SELECT first_name,last_name FROM users WHERE id = ?;`, [ id ], function ( err, row )
          {
            console.log( row )
            if ( row )
            {
              const name = `${ row.first_name } ${ row.last_name }`;
              db.run( `UPDATE users SET fullname = ? WHERE id = ?`, [ name, id ], function ( err ) 
              {
                if ( err )
                {
                  return res.send( toJSON( code[ "400" ] ) );
                } else
                {
                  const response = code[ "200" ];
                  response.changes = this.changes;
                  return res.send( toJSON( response ) );
                }
              } );
            } else
            {
              return res.send( toJSON( code[ "400" ] ) );
            }
          } );
        } else
        {
          return res.send( JSON.stringify( {
            code: 200
          } ) );
        }
      }
    } )
  } else if ( action === "delete" )
  {
    const id = parseInt( data.id );
    if ( !id )
      return res.send( toJSON( code[ "400" ] ) );
    db.run( "DELETE FROM users WHERE id = ?;", [ id ], function ( err )
    {
      if ( err )
      {
        return res.send( toJSON( code[ "400" ] ) );

      } else
      {
        const response = code[ "200" ];
        response.changes = this.changes;
        return res.send( toJSON( response ) );
      }
    } );
  }
} );

app.listen( port );
