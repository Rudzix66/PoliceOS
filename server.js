const express = require( "express" );
const sqlite3 = require( "./db" );
const db = sqlite3.db;
// const query = sqlite3.query;
const queries = sqlite3.queries;
// const tables = sqlite3.tables;
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
  let select = "SELECT * FROM users WHERE id = ?;";
  let data = [ id ];
  if ( req.params.id === "*" )
  {
    select = "SELECT * FROM users;";
    data = [];
  }
  console.log( select )
  db.all( select, data, ( err, row ) =>
  {
    if ( err )
    {
      res.send( JSON.stringify( { code: 400 } ) );

    } else
    {
      res.send( JSON.stringify( row ) );
    }
  } );
} );

app.post( "/users", ( req, res ) =>
{
  const wrong = JSON.stringify( {
    code: 400
  } );
  const data = req.body;
  const action = data.action;
  if ( !action )
    return res.send( wrong );

  if ( action === "add" )
  {
    const first_name = data.first_name.trim();
    const last_name = data.last_name.trim();
    const fullname = `${ first_name } ${ last_name }`;
    let birth_date = data.birth_date.trim();
    const date = new Date( birth_date );
    if ( !first_name || !last_name || !birth_date || isNaN( date.getTime() ) )
      return res.send( wrong );
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${ date.getMonth() + 1 }` : date.getMonth;
    const day = date.getDate() < 10 ? `0${ date.getDate() }` : date.getDate();
    birth_date = `${ year }-${ month }-${ day }`;
    db.run( queries.userAdd, [ first_name, last_name, fullname, birth_date ], err =>
    {
      if ( err )
      {
        return res.send( wrong );
      } else
      {
        return res.send( JSON.stringify( {
          code: 200
        } ) );
      }
    } )

  } else if ( action === "update" )
  {
    const id = parseInt( data.id );
    const name = data.name.trim();
    const value = data.value.trim();
    const available = [ "first_name", "last_name", "birth_date" ]
    if ( ( !id || !name || !value ) || ( !available.indexOf( value ) ) )
      return res.send( wrong );
    db.run( `UPDATE users SET ${ name } = ? WHERE id = ?`, [ value, id ], err =>
    {
      if ( err )
      {
        return res.send( wrong );
      } else
      {
        if ( name === "first_name" || name === "last_name" )
        {
          db.all( `SELECT first_name,last_name FROM users WHERE id = ? LIMIT 1;`, [ id ], ( err, row ) =>
          {
            if ( row )
            {
              row = row[ 0 ];
              const name = `${ row.first_name } ${ row.last_name }`;
              console.log( name )
              db.run( `UPDATE users SET fullname = ? WHERE id = ?`, [ name, id ], err =>
              {
                if ( err )
                {
                  return res.send( wrong );
                } else
                {
                  return res.send( JSON.stringify( {
                    code: 200
                  } ) );
                }
              } );
            } else
            {
              return res.send( wrong );
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
      return res.send( wrong );
    db.run( "DELETE FROM users WHERE id = ?;", [ id ], err =>
    {
      if ( err )
      {
        return res.send( wrong );

      } else
      {
        return res.send( JSON.stringify( {
          code: 200
        } ) );
      }
    } );
  }
} );

app.listen( port );
