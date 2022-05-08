import pool from "../pool.js";
import { reorderUsersData } from "../reorder_functions.js"

async function getUsers(){
    const query = `SELECT * FROM users;`
    try {
        const result = await pool.query(query)
        const users = reorderUsersData(result.rows)
        return users
    } catch (error) {
        console.log(error.message);
    }
}

async function getUser(id){
    const queryBbj = {
        text: `SELECT * FROM users WHERE id=$1;`,
        values: [id]
    }
    try {
        const result = await pool.query(queryBbj)
        return result.rows
    } catch (error) {
        console.log(error.message)
    }
}

export {getUser, getUsers}