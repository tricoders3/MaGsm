import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

dotenv.config()

connectDB()

// --------------------
// App Express
// --------------------
const app = express()

app.use(cookieParser());

app.use(express.json())

// --------------------
// Routes test
// --------------------
app.get('/', (req, res) => {
  res.send('🚀 Backend running')
})

app.use('/api/auth', authRoutes);


// --------------------
// Server
// --------------------
const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
