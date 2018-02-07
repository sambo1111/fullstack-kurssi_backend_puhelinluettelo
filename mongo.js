const mongoose = require('mongoose')

const url = 'mongodb://sambo1111:fullstack12@ds125388.mlab.com:25388/puhelinluettelo_db'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 2) {
  Person
    .find({})
    .then(result => {
      if (result.length < 1) {
        mongoose.connection.close()
        return console.log("No persons in database!")
      }
      console.log("phonebook:")
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
  const newPerson = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  newPerson
    .save()
    .then(result => {
      console.log(`new person ${newPerson.name} ${newPerson.number} saved!`)
      mongoose.connection.close()
    })
} else {
  console.log("Incorrect number of parameters!")
}
