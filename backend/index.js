const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body '), express.json(), express.static('dist'), cors());
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/', (request, response) => {

    response.send('<h1>Hello wrald!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let formattedTime = new Date().toString()
    response.send(`
        <p>PhoneBook has ${persons.length} people</p>
        ${formattedTime}    
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => id === person.id)

    if (person) {
        response.json(person)    
    }   else {
        response.status(404).end()
    }
    
    
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

const duplicate = (name) => {
    return persons.find(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if ((!body.name || !body.number) || duplicate(body.name)) {
        return response.status(400).json({
            error: 'missing number or name'
        })
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    
    persons = persons.concat(person)
    
    response.send(request.body)

})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(205).end()
})
//!!!!!!!!!!     \/
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})