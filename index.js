const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person")

morgan.token('body', (req) => req.body ? JSON.stringify(req.body) : "")
const morganFilter = (':method :url :status :res[content-length] - :response-time ms :body')

const PORT = process.env.PORT || 3001;
const handleResponse = (resp, result, status = -1) =>{
    if (!result)
    {m
        return resp.status(404).json({"Error": "Person couldn't be found."});
    }
    if (status !== -1)
    {
        return resp.status(status).end();
    }
    return resp.json(result);
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

app.get("/info", (req, res, next) => {
    Person.find({}).then(persons => {
        res.send(`Phonebook has info for ${persons.length} people<p>${new Date()}</p>`)
    }).catch(error => next(error))
})
app.post("/api/persons", (req, res, next) => {
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
        .catch(error => next(error));
})
app.get("/api/persons", (req, res, next) =>
    Person.find({}).then(persons => {
        res.json(persons);
    }).catch(error => next(error))
)
app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person => handleResponse(res, person)
    ).catch(error => next(error))
})
app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(person => handleResponse(res, person, 204)).catch(error => next(error))
})
const errorHandler = (error, req, res, next) =>{
    if (error.name === "CastError")
    {
        return res.status(400).json({"Error":"Wrong ID format"});
    }
    if (error.name === "ReferenceError")
    {
        return res.status(404).json({"Error":"Person doesn't exist"});
    }
    const status = error.status?error.status:500;
    if (error?.json)
    {
        return res.status(status).json(error.json);
    }
    if (error?.name)
    {
        return res.status(status).json({"Error":`${error.name}`});
    }
    next(error);
}
const badRequestHandler = (req, res) =>
{
    res.status(404).json({"Error 404": "Unknown endpoint"});
}

app.use(badRequestHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

