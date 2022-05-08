import pool from "../pool.js";
import { reorderReservationsData, reorderUsersData } from "../reorder_functions.js"

async function getReservations(){
    const query = `SELECT * FROM reservations Where active = 't';`
    try {
        const results = await pool.query(query)
        return results.rows
    } catch (error) {
        console.log(error.message);
    }
}

async function getUserReservations(email){
    const query = `SELECT * FROM reservations WHERE user_email=${email} AND active = 't';`
    try {
        const results = await pool.query(query)
        return results.rows
    } catch (error) {
        console.log(error.message);
    }
}

async function getHoursByDate(date){
    const query_obj = {
        text: `SELECT start_time FROM reservations WHERE date = $1;`,
        values: [date]
    } 
    try {
        const results = await pool.query(query_obj)
        return results.rows
    } catch (error) {
        console.log(error.message);
    }
}

async function insertReservation({date, start_time, rut, first_name, last_name, email}){
    const query_obj = {
        text: "INSERT INTO reservations (date, start_time, user_rut, user_name, user_last_name, user_email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*",
        values: [date, start_time, rut, first_name, last_name, email]
    } 
    try {
        const result = await pool.query(query_obj)
        return result.rowCount
    } catch (error) {
        await pool.rollback
        console.log(error.message);
    }
}

async function updateReservation({id, date, start_time, rut, first_name, last_name, email}){
    const query_obj = {
        text: `UPDATE reservations SET date = $2, start_time = $3, user_rut = $4, user_name = $5, user_last_name= $6, user_email = $7 WHERE id = $1 RETURNING*`,
        values: [id, date, start_time, rut, first_name, last_name, email]
    }
    try {
        const result = await pool.query(query_obj)
        return result.rowCount
    } catch (error) {
        await pool.rollback
        console.log(error.message)
    }
}

async function deleteReservation(id){
    const query = `UPDATE reservations SET active = false WHERE id = ${id} RETURNING*;`
    try {
        const result = await pool.query(query)
        return result.rowCount
    } catch (error) {
        await pool.rollback
        console.log(error.message);
    }
}

export {getReservations, insertReservation, updateReservation, getUserReservations, deleteReservation, getHoursByDate}