const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

app.use(morgan('tiny'))

let persons = [
  {
    name: "Arto Hellas",
    number: "666",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "777",
    id: 2
  },
  {
    name: "Matti Luukkainen",
    number: "888",
    id: 3
  },
  {
    name: "Jorma",
    number: "999",
    id: 4
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
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
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('running')
})
