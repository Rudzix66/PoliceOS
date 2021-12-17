const express = require( "express" );

const app = express();
const port = 3000;

let name = "Kuba";
let rank = "SII";

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
  res.render( "test.html" )
} );

app.post( "/user", ( req, res ) =>
{
  console.log( '--> user' );
  res.send( JSON.parse( `{"name": "${ name }", "rank": "${ rank }"}` ) )
} );
app.listen( port )