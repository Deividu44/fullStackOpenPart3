const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false) // Allow other fields that arent in your Schema

mongoose.connect(url)
.then(result => console.log('Connected to Mongo'))
.catch(error => console.log('Failed to connecto to the DB', error.message))


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: v => {
        return /^\d{2,3}-\d{7,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    minLength: 8,
    required: true
}
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // cause returnedObject._id is an Object
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personSchema)