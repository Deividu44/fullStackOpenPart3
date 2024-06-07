const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(cors())
morgan.token('person', req => {
   return JSON.stringify(req.body)
})

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
      return res.status(400).send({ error: error.message })
  }
  next(error)
}
// GET
app.get('/', (req, res) => {
  res.send('<h1>Hello there</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => res.json(result))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(result => {
    if (result) {
      res.json(result)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({})
  .then(people => {
    res.send(`<p>Phonebook has info for ${people.length} people</p>
    <br/> ${Date()}`)
  })

})

const morganCustom = morgan(':method :url :status :res[content-length] - :response-time ms :person')
// POST
app.post('/api/persons', morganCustom, (req,res, next) => {
  const body = req.body

  Person.find({ name: body.name })
  .then(person => {
    if(person === body.name) 
      return res.status(400).json({ error: 'Name must be unique'})
  })

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save()
  .then(savedPerson => res.json(savedPerson))
  .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => res.status(204).end())
  .catch(error => next(error))
})

// PUT
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const newPerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, newPerson, {new: true})
  .then(updatedPerson => res.json(updatedPerson))
  .catch(error => next(error))

})


app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`PhoneBook app listen to port ${PORT}`);
})
app.use(errorHandler)