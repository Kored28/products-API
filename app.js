require('express-async-errors')
require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const products = require('./routes/products')



const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


//middleware
app.use(express.json())


//routes
app.get('/', (req, res) => {
    res.send('konichiwa')
})

app.use('/api/v1/products', products)


//products routes
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


//Port
const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`The server is running on ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()