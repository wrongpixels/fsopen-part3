const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person")

morgan.token('body', (req) => req.body ? JSON.stringify(req.body) : "")
const morganFilter = (':method :url :status :res[content-length] - :response-time ms :body')


const PORT = process.env.PORT || 3001;
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
const getPersonFromID = (id) => persons ? persons.find(p => p.id === id) : null;

const app = express();
app.use(express.json());
app.use(morgan(morganFilter));
app.use(express.static('dist'));

app.get("/", (req, res) => {
    res.json({"message": "Phonebook"});
})

app.get("/api", (req, res) => {
    res.json({"message": "Phonebook API"});
})

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        res.send(`Phonebook has info for ${persons.length} people<p>${new Date()}</p>`)
    })
})
app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body || !body.name || !body.number) {
        return res.status(400).json({"Error": "New person is missing name or number"});
    }
    /*
    if (getPersonFromName(body.name)) {
        return res.status(400).json({"Error": `'${body.name}' already exists. Names must be unique.`})
    }*/
    const newPerson = new Person({
        name: body.name,
        number: body.number})
    newPerson.save()
        .then(savedPerson => {
            res.json(savedPerson);
        })
        .catch(error => res.status(500).json({"Error": "Person couldn't be created"}));
})
app.get("/api/persons", (req, res) =>
    Person.find({}).then(persons => {
        res.json(persons);
    }).catch(() => res.json({"Error":"Couldn't gather persons"}))
)
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (!person)
        {
            return res.status(404).json({"Error":`Person ${id} was not found`})
        }
        res.json(person);
    }).catch(error => res.status(500).json({"Error":"Couldn't complete operation"}))
})
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = getPersonFromID(id);
    if (person) {
        persons = persons.filter(p => p.id !== id);
        res.status(204).end();
    } else {
        res.status(404).json({"Error": `Person ${id} was not found`});
    }
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

