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
    id: person.id,
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
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })

})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(formatPerson(person))
    })
    .catch (error => {
      response.status(400).send({error: 'malformatted id'})
    })
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then (persons => {
      response.send(`<div> puhelinluettelossa ${persons.length} henkilön tiedot </div>
                     <div> ${new Date()}`)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error: 'malformatted id'})
    })
})

app.post('/api/persons', (request, response) => {

  if (request.body.name === undefined || request.body.number === undefined) {
    return response.status(400).json({error: 'bad request'})
  }

  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  Person
    .find({name: newPerson.name})
    .then(result => {
      if (result.length < 1) {
        newPerson
        .save()
        .then(savedPerson => {
          response.json(formatPerson(savedPerson))
        })
        .catch(error => {
          console.log(error)
          response.status(404).end()
        })
      }
      response.status(409).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
