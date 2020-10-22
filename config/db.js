const mongoose = require('mongoose')

const connectDB = async () => {
  const conn = await mongoose.connect(
    'mongodb://localhost:27017/devconnector',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  console.log('MongoDB Connected...')
}

module.exports = connectDB
