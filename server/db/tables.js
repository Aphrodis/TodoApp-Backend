import pool from './connection';

const tables = `DROP TABLE IF EXISTS users, todos CASCADE;
    CREATE TABLE users (
        userId UUID NOT NULL PRIMARY KEY,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL
    );
    CREATE TABLE todos (
        taskId UUID NOT NULL PRIMARY KEY,
        userId VARCHAR NOT NULL,
        createdOn TIMESTAMP,
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
