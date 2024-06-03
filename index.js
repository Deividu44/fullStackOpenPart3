const express = require('express')
const morgan = require('morgan')


const app = express()
const PORT = 3001

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(morgan('tiny'))
morgan.token('person', req => {
   return JSON.stringify(req.body)
   
})



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
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

  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if(person) {
    res.json(person)
    console.log('Found')
  } else {
    res.status(404).end()

  }

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

  const isPerson = persons.find(p => p.name === body.name)
  if(isPerson) return res.status(400).json({ // Check if name exists
    error: "Name must be unique"
  })

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons.concat(newPerson)
  //console.log(newPerson)
  res.json(newPerson)

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