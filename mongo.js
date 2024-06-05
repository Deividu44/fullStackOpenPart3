const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

console.log(process.argv.length);

const url = `mongodb+srv://fullstack:${password}@cluster0.h2ikjsq.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 4) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.number}`))
  mongoose.connection.close()

  })
} else{
  const person = new  Person({
    name,
    number
  })
  
  person.save().then(result => {
    console.log(`Added ${result.name} - Number: ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}






