const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// 3.20*: Custom validator for phone number format
// Must be 8+ chars, formed as XX-XXXXXXX or XXX-XXXXXXX
const phoneValidator = (value) => {
  return /^\d{2,3}-\d+$/.test(value) && value.length >= 8
}

const personSchema = new mongoose.Schema({
  // 3.19*: name must be at least 3 characters long and is required
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
  },
  // 3.20*: number must pass format check and be 8+ chars
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: phoneValidator,
      message: 'Number must be at least 8 characters, in format XX-XXXXXXX or XXX-XXXXXXX',
    },
  },
})

// 3.13–3.18: Transform _id → id and remove __v from all responses
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
