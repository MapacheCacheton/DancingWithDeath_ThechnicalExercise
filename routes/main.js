import express from 'express'
import { root } from '../config.js'

// Router Creation
const router = express.Router()

// Routes
router.get('/', (_, res) => {
    res.render('index', { title: 'Inicio' })
})

router.get('/css', (_, res)=>{
    res.sendFile(`${root}/public/css/styles.css`)
})


export default router
