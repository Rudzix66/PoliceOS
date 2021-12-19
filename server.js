const express = require( "express" );
const sqlite3 = require( "./db" );
const db = sqlite3.db;
const query = sqlite3.query;
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

app.get( "/users/:id", async ( req, res ) =>
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

app.listen( port );
