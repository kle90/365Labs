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
} );;

async function getUsers( req, res ) {
    console.log( 'Request to get all users from the database' );
    try {
        const connection = await pool.getConnection();
        console.log( 'Successfully connected to the database' );
        const [ rows, fields ] = await connection.query( 'select * from lab2_users' );
        res.status( 200 )
            .send( rows );
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting users: ${ err }` );
    }
}
app.get( '/users', getUsers );

async function getAUser ( req, res ) {
    console.log( 'Request to get one user from database' );
    try {
        const connection = await pool.getConnection();
        console.log ( 'Successfully connected to database' );
        const sql = 'SELECT * from lab2_users WHERE user_id=?'
        const values = [req.params.id]
        const [ rows, fields ] = await connection.query( sql, [values] )

        if (rows.length == 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send( rows[0] );
        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting user: ${ err }` );
    }
}
app.get( '/users/:id', getAUser);

async function postUser( req, res ) {
    console.log( 'Request to add a new user to the database' );
    try {
        const connection = await pool.getConnection();
        const sql = 'insert into lab2_users (username) values ( ? )';
        const values = [ req.body.username ];
        await connection.query( sql, [ values ] );
        res.status( 201 )
            .send(`User successfully added to the database`, values.insertId);
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR posting user: ${ err }` )
    }
}
app.post( '/users', postUser );

async function putUser( req, res ) {
    console.log( 'Request to edit an existing user in the database' );

    try {
        const connection = await pool.getConnection();
        const sql = await connection.query( 'UPDATE lab2_users SET username WHERE user_id (?)' );
        const values = [ req.body.username ];
        await connection.query( sql, [ values] );
        res.status( 201 )
            .send(`User successfully added to the database`);
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR posting user: ${ err }` )
    }
}
app.post( '/users/id', postUser );

// async function deleteUser( req, res) {
//     try {
//
//     }
// }

const port = process.env.PORT || 3000;
app.listen( port, () => {
    console.log( `Listening on port: ${ port }` );
} );