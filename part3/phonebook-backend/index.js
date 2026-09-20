const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// ── Initial data ──────────────────────────────────────────────────────────────
let persons = [
  { id: '1', name: 'Arto Hellas',       number: '040-123456'    },
  { id: '2', name: 'Ada Lovelace',      number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov',       number: '12-43-234345'  },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
]

// ── Middleware ────────────────────────────────────────────────────────────────

// 3.9: Enable CORS for cross-origin requests (dev mode)
app.use(cors())

// 3.11: Serve frontend production build as static files
app.use(express.static('dist'))

// 3.8*: Custom morgan token that logs request body for POST requests
morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(express.json())

// 3.7: morgan 'tiny' format + body token for POST requests
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// ── Routes ────────────────────────────────────────────────────────────────────

// 3.1: GET all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2: Info page
app.get('/info', (request, response) => {
  const count = persons.length
  const time = new Date()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `)
})

// 3.3: GET a single person by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'person not found' })
  }
})

// 3.4: DELETE a person by id
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

// 3.5 + 3.6: POST — add a new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  // 3.6: Validate — name and number must be present
  if (!body.name) {
    return response.status(400).json({ error: 'name is missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  // 3.6: Validate — name must be unique
  const nameExists = persons.some(
    p => p.name.toLowerCase() === body.name.toLowerCase()
  )
  if (nameExists) {
    return response.status(409).json({ error: 'name must be unique' })
  }

  // 3.5: Generate a random id with a large enough range
  const person = {
    id: String(Math.floor(Math.random() * 1_000_000)),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

// ── Unknown endpoint handler ───────────────────────────────────────────────────
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// ── Start server ──────────────────────────────────────────────────────────────
// 3.10: Use PORT env variable for cloud deployments (Render, Fly.io, etc.)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
