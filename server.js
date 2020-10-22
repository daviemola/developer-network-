const express = require('express')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.get('/', (req, res) => {
  res.send('API running')
})

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => `Server running on port ${PORT}`)

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  //close server & exit process
  server.close(() => process.exit(1))
})
