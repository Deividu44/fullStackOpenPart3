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

let persons = [
  { 
    "id": 1,
    "name": "Artos Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 2000)
}

// GET
app.get('/', (req, res) => {
  res.send('<h1>Hello there</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => res.json(result))
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(result => res.json(result))
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <br/> ${Date()}`)
})

const morganCustom = morgan(':method :url :status :res[content-length] - :response-time ms :person')
// POST
app.post('/api/persons', morganCustom, (req,res) => {
  const body = req.body

  if(!body.name || !body.number) { // Check if body have name and number parameter
    return res.status(400).json({
      error: "Name or number is missing"
    })
  }

  const isPerson = Person.find({ name: body.name })
  console.log(isPerson)
  if(isPerson) return res.status(400).json({ // Check if name exists
    error: "Name must be unique"
  })

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => res.json(savedPerson))
})

// DELETE
  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  })


app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`PhoneBook app listen to port ${PORT}`);
})