const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.URI_MONGODB

mongoose.connect(url).then(() => console.log('Connected to MongoDB')).catch(error => console.log('Error connecting to MongoDB', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'The name must be at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: [8, 'The phone number must be at least 8 characters long'],
    validate: {
      validator: (v) => {
        const parts = v.split('-')
        if (parts.length <= 1 || parts.length > 2)
        {
          return false
        }
        if (parts[0].length <= 1 || parts[0].length > 3)
        {
          return false
        }
        if (parts[1].length < 1)
        {
          return false
        }
        return !isNaN(Number(parts[0]))  && !isNaN(Number(parts[1]))
      },
      message:'Please, only use numbers separated with a single \'-\' (Format: XX-XXXXXX)'

    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id
    delete returned._id
    delete returned.__v
  }
})
module.exports = mongoose.model('Person', personSchema)