const mysql = require('mysql2/promise');
require( 'dotenv' ).config( { path: '../.env' } );
async function main() {

    const pool = await mysql.createPool( {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    } );
    const connection = await pool.getConnection();
    const [ rows ] = await connection.query( 'select * from lab2_users' );
    connection.release();
    console.log( 'Users:', rows );

    const sql = "insert into lab2_users (username) values ?";
    const values = [
        [ 'James' ],
        [ 'Lotte' ],
        [ 'Adrien' ],
        [ 'Elske' ],
        [ 'Alex' ]
    ];
    const [ result ] = await connection.query( sql, [ values ] );
    console.log( "Number of records inserted: ", result.affectedRows );
}



main()
    .catch(err => console.error(err));
