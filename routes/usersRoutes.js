import express from 'express'

// Router Creation
const router = express.Router()

// Routes
router.get('/', (_, res) => {
    res.render('userReservations', { title: 'DWD: User reservations' })
})

export default router
