import { port , root} from './config.js'
import express from 'express'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'

// Routes
import mainRoutes from './routes/main.js'
import apiRoutes from './routes/apiRoutes.js'
import userRoutes from './routes/usersRoutes.js'

// Server
const app = express()

// body-parser -> From Express 4.16+
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Public Folder
app.use(express.static('public'))
app.use(express.static('public/css'))

// Handlebars
app.set('view engine', '.hbs')
app.engine('.hbs', handlebars.engine({ 
    extname: '.hbs',
    defaultLayout: 'main'
}))

// App Routes
app.use(mainRoutes)
app.use('/api/v1', apiRoutes)
app.use('/user-reservations', userRoutes)

// 404 Page
app.get("*", (req, res) => {
    res.render('404', { title: 'Oh no! a 404 :(' })
})

// Server Running
app.listen(port, _ => console.log(`Server Running at: http://localhost:${port}/`))