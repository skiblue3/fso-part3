const { response, request, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

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

// for json-parser
app.use(express.json())

// for logging use morgan
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms')) or 'tiny'
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })   // returns body for logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// for using the build
app.use(express.static('build'))

// for getting info about api
app.get('/info', (request, response) => {
    let time = new Date().toString()
    console.log(time)
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${time}</p>`)
})

// for getting persons data
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// fetching a single resource
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    }
    else {
        response.statusMessage = "Invalid id"
        response.status(404).end()
    }
})

// deleting a single entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// to generate id
const generateId = () => {
    return Math.floor(Math.random() * 1000)
}

// posting a new entry
app.post('/api/persons', (request,response) => {
    const body = request.body
    
    // if name or number is missing
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }
    // to check name exist or not
    const names = persons.reduce((names, person) => {
        return names.concat(person.name.toLowerCase())
    }, [])
    console.log(names)
    if(names.includes(body.name.toLowerCase())) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})