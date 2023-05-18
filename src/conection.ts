import { rejects } from 'assert';
import * as fs from 'fs';
import * as sql from 'mssql';

function readConnectionFile(): Promise<sql.config> {
    const filePath = './connection.json';
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (error, fileData) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                const jsonObject = JSON.parse(fileData);
                const config: sql.config = {
                    user: jsonObject.user,
                    password: jsonObject.password,
                    server: jsonObject.server,
                    database: jsonObject.database,
                    options: {
                        enableArithAbort: true,
                    },
                };
                resolve(config);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}
async function connectToDatabase(): Promise<sql.ConnectionPool> {
    try {
        const config = await readConnectionFile();
        const pool = new sql.ConnectionPool(config);
        await pool.connect();
        console.log('Connected to the database.');
        return pool;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

async function disconnectFromDatabase(pool: sql.ConnectionPool): Promise<void> {
    try {
        await pool.close();
        console.log('Disconnected from the database.');
    } catch (error) {
        console.error('Error disconnecting from the database:', error);
        throw error;
    }
}