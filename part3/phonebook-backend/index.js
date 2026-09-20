// Load environment variables first (before any module that reads process.env)
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────

// 3.9: Enable CORS for cross-origin requests (dev mode)
app.use(cors())

// 3.11: Serve frontend production build as static files
app.use(express.static('dist'))

app.use(express.json())

// 3.8*: Custom morgan token — logs request body for POST requests
morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

// 3.7: morgan format + body token for POST requests
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// ── Routes ────────────────────────────────────────────────────────────────────

// 3.13: GET all persons — fetched from MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// 3.18: Info page — count fetched live from DB
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const time = new Date()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      `)
    })
    .catch(error => next(error))
})

// 3.18: GET a single person by id — from DB
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

// 3.15: DELETE a person by id — from DB
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.14: POST — save a new person to DB
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name is missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// 3.17*: PUT — update an existing person's number
// 3.19/3.20: validators are disabled on update by default, so we use
// findById + .save() (which runs validators) instead of findByIdAndUpdate
app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.number = number
      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// ── Unknown endpoint handler ───────────────────────────────────────────────────
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// ── 3.16: Centralized error handler middleware ─────────────────────────────────────
// Must be the last middleware loaded
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  // 3.19*: Return Mongoose validation error messages to the client
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// ── Start server ──────────────────────────────────────────────────────────────
// 3.10: Use PORT env variable for cloud deployments (Render, Fly.io, etc.)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
