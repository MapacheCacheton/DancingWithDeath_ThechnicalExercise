import express from 'express'
import {getReservations, insertReservation, updateReservation, getUserReservations, deleteReservation, getHoursByDate, getUserReservation} from '../db/queries/reservations.js'
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
router.get('/reservations/:rut', async(req, res)=>{
    const {rut} = req.params
    try {
        const user_reservations = await getUserReservations(rut)
        if(!!user_reservations[0]){
            res.status(200).send(JSON.stringify(user_reservations))
        }else res.status(500).send({message:'The requested user does not exist or does not have a reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error getting user reservations'})
    }
})
//Brings a single reservation of one user using their id
router.get('/reservation/:id', async(req, res)=>{
    const {id} = req.params
    try {
        const user_reservation = await getUserReservation(id)
        res.status(200).send(JSON.stringify(user_reservation[0]))
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error getting user reservations'})
    }
})
//Recives a date and searches for every taken hour and sends them to the client, if there isn't any taken hours, sends an approval message (indicates that every hour is available) or sends an error message in case of failure 
router.post('/reservation/hours', async(req, res) => {
    const {date} = req.body
    try {
        const hours = await getHoursByDate(date)
        if (!!hours.length) res.status(200).send(JSON.stringify(hours))
        else res.status(200).send({available:true})
    } catch (error) {
        res.status(500).send({message:'Can\'t access available hours, try again later'})
    }
})
//Recives a payload and inserts a reservation returning a success or error response
router.post('/reservation', async (req, res)=>{
    const reservation = req.body
    try {
        const inserted_records = await insertReservation(reservation)
        if (!!inserted_records) res.status(200).send({approved: true})
        else res.status(500).send({message:'Can\'t insert reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Can\'t insert reservation'})
    }
})
//Recives a payload and modify the reservation info returning a success or error response
router.put('/reservation', async (req, res)=>{
    const edited_reservation = req.body
    try {
        const edited_records = await updateReservation(edited_reservation)
        if (!!edited_records)  res.status(200).send({approved: true})
        else res.status(500).send({message:'Error editing reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error editing reservation'})
    }

})
//Recives an id and modify the "active" column of the reservation to false(non active or deleted)
router.delete('/reservation', async (req, res)=>{
    const {id} = req.body
    try {
        const deleted_records = await deleteReservation(id)
        if (!!deleted_records)  res.status(200).send({approved: true})
        else res.status(500).send({message:'Error deleting reservation'})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:'Error deleting reservation'})
    }
})

export default router