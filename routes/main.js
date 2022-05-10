import express from 'express'
import { root } from '../config.js'

// Router Creation
const router = express.Router()

// Routes
router.get('/', (_, res) => {
    res.render('index', { title: 'Inicio' })
})

router.get('/css/main', (_, res)=>{
    res.sendFile(`${root}/public/css/mainStyles.css`)
})
router.get('/css/user', (_, res)=>{
    res.sendFile(`${root}/public/css/userReservationsStyles.css`)
})


export default router
