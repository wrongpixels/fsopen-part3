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
const getPersonFromName = (name) => persons ? persons.find(p => p.name === name) : null;
const getRandomNumber = () => {
    let randomString = "";
    const fixedMin = Math.ceil(0);
    const fixedMax = Math.floor(99999);
    randomString = String(Math.floor(Math.random() * (fixedMax - fixedMin) + 1 + fixedMin));
    return randomString;
}
const getNewRandomID = () => {
    const newID = getRandomNumber();
    const existingPerson = getPersonFromID(newID);
    if (existingPerson) {
        return getNewRandomID();
    }
    return String(newID);
}
const getRequestData = (req) => {
    if (!req.body || req.body.length === 0) {
        return "";
    }
    return JSON.stringify(req.body);
}

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
    const count = persons ? persons.length : 0;
    const time = new Date();
    res.send(`Phonebook has info for ${count} people<p>${time}</p>`)
})
app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body || !body.name || !body.number) {
        return res.status(400).json({"Error": "New person is missing name or number"});
    }
    if (getPersonFromName(body.name)) {
        return res.status(400).json({"Error": `'${body.name}' already exists. Names must be unique.`})
    }
    const newPerson = {
        "id": getNewRandomID(),
        "name": body.name,
        "number": body.number
    }
    persons = persons.concat(newPerson);
    res.json(newPerson);
})
app.get("/api/persons", (req, res) =>
    Person.find({}).then(persons => {
        res.json(persons);
        console.log("Gathered",persons.length)
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
    }).catch(error => res.status(404).json({"Error":"Couldn't complete operation"}))
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

