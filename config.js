//Se importan 
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
//Dotenv config
dotenv.config()

const port = process.env.PORT || 3000
const root = dirname(fileURLToPath(import.meta.url))
const db = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.dbport
}

export { port, root, db }
