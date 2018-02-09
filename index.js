const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

let persons = []

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number
  }
}

app.get('/api/persons', (request, response) => {
  const body = request.body
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
    })

})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(p => p.id === Number(request.params.id))
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`<div> puhelinluettelossa ${persons.length} henkilön tiedot </div>
                 <div> ${new Date()}`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  if (persons.find(p => p.id === id)) {
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const random = Math.floor(Math.random() * Math.floor(1000))
  if (request.body.name === undefined || request.body.number === undefined) {
    return response.status(400).json({error: 'bad request'})
  } else if (persons.find(p => p.name === request.body.name)) {
    return response.status(409).json({error: 'name must be unique'})
  }

  const newPerson = {
    name: request.body.name,
    number: request.body.number,
    id: random
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
