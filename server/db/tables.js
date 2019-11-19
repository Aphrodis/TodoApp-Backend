import pool from './connection';

const tables = `DROP TABLE IF EXISTS users, todos CASCADE;
    CREATE TABLE users (
        userid UUID NOT NULL PRIMARY KEY,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL
    );
    CREATE TABLE todos (
        userid VARCHAR NOT NULL,
        taskid UUID NOT NULL PRIMARY KEY,
        createdOn TIMESTAMP DEFAULT NOW(),
        title TEXT NOT NULL,
        description TEXT NOT NULL
    ); `;
const createTables = async () => {
    try {
        await pool.query(tables);
        console.log('Tables created successfully');
    } catch (err) {
        console.log(err);
    }
};
createTables();
