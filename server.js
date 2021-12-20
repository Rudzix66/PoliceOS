const express = require( "express" );
const sqlite3 = require( "./db" );
const db = sqlite3.db;
const query = sqlite3.query;
const queries = sqlite3.queries;
const tables = sqlite3.tables;
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

app.get( "/views/html", ( req, res ) =>
{
  res.render( "./html/test" )
} );

app.get( "/users/:id", ( req, res ) =>
{
  const id = parseInt( req.params.id );
  const query2 = "SELECT * FROM users WHERE id = ?";
  db.all( query2, [ id ], ( err, row ) =>
  {
    if ( err )
    {
      console.log( err )
    } else
    {
      res.send( JSON.stringify( row ) );
    }
  } );
  console.log( query.select( "SELECT * FROM users;", [] ) )
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
    const age = parseInt( data.age );
    const birth_date = data.birth_date.trim();
    if ( !first_name || !last_name || !age || !birth_date )
      return res.send( wrong );

    db.run( queries.userAdd, [ first_name, last_name, fullname, age, birth_date ], err =>
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
    const name = data.name;
    const value = data.value;
    if ( !id || !name || !value )
      return res.send( wrong );
    db.run( `UPDATE users SET ${ name } = ? WHERE id = ?`, [ value, id ], err =>
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
