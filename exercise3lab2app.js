const mysql = require( 'mysql2/promise' );
require( 'dotenv' ).config( { path: '../.env' } );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
app.use( bodyParser.json() );

const pool = mysql.createPool( {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
} );

async function listConvos( req, res ) {

    console.log( "Request to get all conversations from the database" );

    try {
        const connection = await pool.getConnection();
        console.log( "Successsfully connected to the database" );

        const [ rows , fields ] = await connection.query( 'SELECT * FROM lab2_conversations' );
        res.status( 201 ).send( rows );
    } catch( err ) {
        res.status( 500 ).send( `ERROR posting user: ${ err }` )
    }
}
app.get( '/conversations', listConvos );

async function listAConvo( req, res ) {
    console.log("Request to get a conversations from the database");

    try {
        const connection = await pool.getConnection();
        console.log("Successfully connected to the database");

        const sql = 'SELECT * from lab2_conversations WHERE convo_id=?';
        const values = [req.params.id];
        const [ rows, fields]  = await connection.query( sql, [values] );
        console.log( "rows is: ", rows)
        console.log( "fields is: ", fields)
        res.status( 200 ).send( rows )

    } catch (err) {
        res.status( 500 ).send(`ERROR posting conversations: ${err}`)
    }
}
app.get( '/conversations/:id', listAConvo );


async function postAConvo( req, res ) {
    console.log( 'Request to add a new conversation.' );

    try {
        const connection = await pool.getConnection();
        const sql = 'INSERT into lab2_conversations (convo_name) values ( ? )';
        const values = [req.body.convo_name];

        await connection.query( sql, [values] );
        res.status( 201 ).send( 'Conversation successfully added to the database' );

    } catch( err ) {
        res.status( 500 ).send( `ERROR posting conversation: ${ err }` )
    }
}
app.post( '/conversations', postAConvo );

async function putConvo( req, res ) {
    console.log( 'Request to edit a conversation.' );

    try {
        const connection = await pool.getConnection();
        const sql = 'UPDATE lab2_conversations SET convo_name=(?) WHERE convo_id=(?)';
        const id = [req.params.id];
        const values = [req.body.convo_name];

        const [ rows, fields ] = await connection.query( sql, [values, id] );
        res.status( 201 ).send( 'Conversation successfully edited in the database' );

    } catch( err ) {
        res.status( 500 ).send( `ERROR editing conversation: ${ err }` )
    }
}
app.put( '/conversations/:id', putConvo );

async function deleteConvo( req, res ) {
    console.log( 'Request to add a new conversation.' );

    try {
        const connection = await pool.getConnection();
        const sql = 'DELETE FROM lab2_conversations WHERE convo_id=( ? )';
        const values = [req.params.id];

        const [ rows, fields ] = await connection.query( sql, values);
        console.log( rows );
        res.status( 200 ).send( rows[0] );

    } catch( err ) {
        res.status( 500 ).send( `ERROR deleting conversation: ${ err }` )
    }
}
app.delete( '/conversations/:id', deleteConvo );



const port = process.env.PORT || 3000;
app.listen( port, () => {
    console.log( `Listening on port: ${ port }` );
} );

