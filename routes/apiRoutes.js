import express from 'express'
import {getReservations, insertReservation, updateReservation, getUserReservations, deleteReservation, getHoursByDate} from '../db/queries/reservations.js'
// import { getUsers, getUser} from '../db/queries/users.js'

// Router Creation
const router = express.Router()

// Routes
//Brings every reservation in the database
router.get('/reservations', async (_, res)=>{
    try {
        const reservations = await getReservations()
        res.status(200).send(JSON.stringify(reservations))
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error getting user reservations'})
    }
})
//Brings every reservation of one user using their email
router.get('/reservation', async(req, res)=>{
    const {email} = req.body
    try {
        const user_reservations = await getUserReservations(email)
        res.status(200).send(JSON.stringify(user_reservations))
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error getting user reservations'})
    }
})
router.post('/hours', async(req, res) => {
    const {date} = req.body
    console.log(date);
    try {
        const hours = await getHoursByDate(date)
        if (!!hours.length) res.status(200).send(JSON.stringify(hours))
        else res.status(500).send({available: true})
    } catch (error) {
        res.status(500).send({message:'Internal server error: Error getting available hours contact the manager or try again later'})
    }
})
//Recives a payload and inserts a reservation, returning a success or error response
router.post('/reservation', async (req, res)=>{
    const reservation = req.body
    try {
        const inserted_records = await insertReservation(reservation)
        if (inserted_records) res.status(200).send({message: 'Reservation approved'})
        else res.status(500).send({message:'Error inserting reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error inserting reservation'})
    }
})
//Recives a payload and modify the reservation info
router.put('/reservation', async (req, res)=>{
    const edited_reservation = req.body
    try {
        const edited_records = await updateReservation(edited_reservation)
        if (edited_records)  res.status(200).send({message: 'Reservation edited successfully'})
        else res.status(500).send({message:'Error editing reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error editing reservation'})
    }

})
//Recives a payload and modify the "active" column of the reservation to false(non active or deleted)
router.delete('/reservation', async (req, res)=>{
    const {id} = req.body
    try {
        const deleted_records = await deleteReservation(id)
        if (deleted_records)  res.status(200).send({message: 'Reservation deleted successfully'})
        else res.status(500).send({message:'Error deleting reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error deleting reservation'})
    }
})

export default router