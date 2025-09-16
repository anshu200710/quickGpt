import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'



const app = express()
const PORT = process.env.PORT


await connectDB()
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// Middleware
app.use(cors())
app.use(express.json())

// routes  
app.get('/', (req, res) => {
    res.send('Api Is Working')
})
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)



app.listen(PORT, ()=> {
    console.log(`SERVER IS RUNNING ON PORT http://localhost:${PORT}`)
})

