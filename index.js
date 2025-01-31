const express = require ("express");

const PORT = 3001;
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
const fetchFromID = (id) => persons?persons.find(p => p.id === id):null;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({"message": "Phonebook"});
})

app.get("/api", (req, res) => {
    res.json({"message": "Phonebook API"});
})

app.get("/info", (req, res) => {
    const count = persons?persons.length:0;
    const time = new Date();
    res.send(`Phonebook has info for ${count} people<p>${time}</p>`)
})
app.get("/api/persons", (req, res) => {
    if (persons && persons.length > 0)
    {
        res.json(persons);
    }
    else
    {
        res.status(404).json({"Error": "No people were found."})
    }
})
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = fetchFromID(id);
    if (!person)
    {
        return res.status(404).json({"Error": `Person ${id} was not found`})
    }
    return res.json(person);
})
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = fetchFromID(id);
    if (person)
    {
        persons = persons.filter(p => p.id !== id);
        res.status(204).end();
    }
    else
    {
        res.status(404).json({"Error Deleting": `Person ${id} was not found`});
    }
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

