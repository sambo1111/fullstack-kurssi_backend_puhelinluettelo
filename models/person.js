const mongoose = require('mongoose')

const db_url = 'mongodb://sambo1111:fullstack12@ds125388.mlab.com:25388/puhelinluettelo_db'

mongoose.connect(db_url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
