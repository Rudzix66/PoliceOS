const express = require( "express" );
const sqlite3 = require( "./db" );
const db = sqlite3.db;
const queries = sqlite3.queries;
const tables = sqlite3.tables;
const toJSON = sqlite3.toJSON;
const code = { 400: { code: 400 }, 200: { code: 200 } };
const app = express();
const port = 3000;

function response ( code = 400, message = "" )
{
  return toJSON( {
    code,
    message
  } );
}

function replaceEmpty ( value = "", empty = 0 )
{
  if ( value instanceof String )
    value.trim();
  if ( !value )
    return empty;
  else return value;
}

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
    db.all( "SELECT * FROM users;", [], function ( err, rows ) 
    {
      if ( rows )
      {
        const response = code[ "200" ];
        response.data = rows;
        const promises = [];
        for ( let i = 0; i < rows.length; i++ )
        {
          const row = rows[ i ];
          const fines = new Promise( ( res, rej ) =>
          {
            db.all( "SELECT * FROM fines WHERE userId = ?;", [ parseInt( row.id ) ], function ( err, result )
            {
              if ( err )
                row.fines = 0;
              else
                row.fines = result.length;
              res();
            } );
          } );
          const arrest = new Promise( ( res, rej ) =>
          {
            db.all( "SELECT * FROM arrest WHERE userId = ?;", [ parseInt( row.id ) ], function ( err, result )
            {
              if ( err )
                row.arrest = 0;
              else
                row.arrest = result.length;
              if ( i === rows.length - 1 )
                console.log( null )
              res();
            } );
          } );
          const notes = new Promise( ( res, rej ) =>
          {
            db.all( "SELECT * FROM notes WHERE userId = ?;", [ parseInt( row.id ) ], function ( err, result )
            {
              if ( err )
                row.notes = 0;
              else
                row.notes = result.length;
              if ( i === rows.length - 1 )
                console.log( null )
              res();
            } );
          } );
          promises.push( fines, arrest, notes )
        }
        Promise.all( promises ).then( () =>
        {
          return res.send( toJSON( response ) )
        } )
      }
      else
      {
        return res.send( toJSON( code[ "400" ] ) );
      }
    } );
  } else
  {
    db.get( "SELECT * FROM users WHERE id = ?;", [ id ], ( err, row ) =>
    {
      if ( row )
      {
        const response = code[ "200" ];
        response.data = row;
        const fines = new Promise( ( res, rej ) =>
        {
          db.all( "SELECT * FROM fines WHERE userId = ?;", [ parseInt( row.id ) ], function ( err, result )
          {
            if ( err )
              row.fines = 0;
            else
              row.fines = result.length;
            res();
          } );
        } );
        const arrest = new Promise( ( res, rej ) =>
        {
          db.all( "SELECT * FROM arrest WHERE userId = ?;", [ parseInt( row.id ) ], function ( err, result )
          {
            if ( err )
              row.arrest = 0;
            else
              row.arrest = result.length;
            if ( i === rows.length - 1 )
              console.log( null )
            res();
          } );
        } );
        const notes = new Promise( ( res, rej ) =>
        {
          db.all( "SELECT * FROM notes WHERE userId = ?;", [ parseInt( row.id ) ], function ( err, result )
          {
            if ( err )
              row.notes = 0;
            else
              row.notes = result.length;
            if ( i === rows.length - 1 )
              console.log( null )
            res();
          } );
        } );
        Promise.all( [ fines, notes, arrest ] ).then( () =>
        {
          return res.send( toJSON( response ) )
        } )
      } else
      {
        return res.send( toJSON( code[ "400" ] ) );
      }
    } );
  }
} );
app.get( "/usersInfo", function ( req, res )
{
  const name = req.query.name;
  const id = parseInt( req.query.id );
  const names = [ "fines", "arrest", "notes" ];
  if ( !~names.indexOf( name ) )
    return res.send( toJSON( code[ "400" ] ) );

  db.all( `SELECT * FROM ${ name } WHERE userId = ?;`, [ id ], function ( err, rows )
  {
    if ( err )
    {
      res.send( toJSON( code[ "400" ] ) )
    } else
    {
      console.log( rows )
      res.send( toJSON( rows ) );
    }
  } );
} );
app.post( "/usersInfo", function ( req, res )
{
  const action = replaceEmpty( req.body.action, "" );
  const view = replaceEmpty( req.body.view, "" );
  const name = replaceEmpty( req.body.name, "" );
  const reason = replaceEmpty( req.body.reason, "" );
  const description = replaceEmpty( req.body.description, "" );
  const value = replaceEmpty( req.body.value, "" );
  const userId = parseInt( req.body.id );
  const available = [ "fines", "arrest", "notes" ];
  const updateAvailable = [ "name", "reason", "description" ]
  // To jest do poprawy....
  if ( !~available.indexOf( view ) || !userId || isNaN( userId ) )
    return res.send( response( 400, toJSON(
      {
        message: "Jedno jest źle",
        view,
        userId
      }
    ) ) );
  const queries = {
    add: {
      query: `INSERT INTO ${ view } (userId,name,description,reason) VALUES (?,?,?,?);`,
      data: [ userId, name, description, reason ],
      cb: function ( err )
      {
        const id = this.lastID;
        if ( err )
        {
          return res.send( response( 400, {
            error: err, data: [ userId, name, description, reason ], query: `INSET INTO ${ view } (userid,name,description,reason) VALUES (?,?,?,?);`
          } ) );
        } else
        {
          return res.send( response( 200, { id } ) );
        }
      }
    },
    update: {
      query: `UPDATE ${ view } SET ${ name } = ? WHERE id = ?;`,
      data: [ value, userId ],
      cb: function ( err )
      {
        const changes = this.changes;
        if ( err )
        {
          return res.send( response( 400, { error: err } ) );
        } else
        {
          res.send( response( 200, { changes } ) );
        }
      }
    },
    delete: {
      query: `DELETE FROM ${ view } WHERE id = ?;`,
      data: [ userId ],
      cb: function ( err )
      {
        const changes = this.changes;
        if ( err )
        {
          return res.send( response( 400, { error: err } ) );
        } else
        {
          res.send( response( 200, toJSON( {
            changes
          } ) ) );
        }
      }
    }
  }
  switch ( action )
  {
    case "add":
      const add = queries.add;
      if ( !name || !description || !userId || !reason )
        return response( 400, "wrong values" );
      db.all( add.query, add.data, add.cb );
      break;
    case "update":
      if ( !~updateAvailable.indexOf( name ) )
        return res.send( toJSON( code[ "400" ] ) );
      const update = queries.update;
      db.all( update.query, update.data, update.cb );
      break;
    case "delete":
      const del = queries.delete;
      db.all( del.query, del.data, del.cb );
      break;
    default:
      res.send( toJSON( code[ "400" ] ) )
      break;
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
    const status = data.status.trim();
    let birth_date = data.birth_date.trim();
    const date = new Date( birth_date );
    if ( !first_name || !last_name || !status || !birth_date || isNaN( date.getTime() ) )
      return res.send( response( 400, "błędne dane" ) );
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${ date.getMonth() + 1 }` : date.getMonth;
    const day = date.getDate() < 10 ? `0${ date.getDate() }` : date.getDate();
    birth_date = `${ year }-${ month }-${ day }`;
    db.run( queries.userAdd, [ first_name, last_name, fullname, status, birth_date ], function ( err )
    {
      if ( err )
      {
        return res.send( response( 400, "baza danych" ) );
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
    const available = [ "first_name", "last_name", "birth_date", "status" ];
    let check = true;
    for ( const item in [ id, name, value ] )
    {
      if ( !item )
      {
        res.send( toJSON( code[ "400" ] ) );
        check = false;
        break;
      }
    }
    if ( !check )
      return;
    if ( !available.indexOf( value ) )
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