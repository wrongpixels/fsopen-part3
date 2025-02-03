const mongoose = require("mongoose");
const password = process.argv.length > 2?process.argv[2]:null;
if (!password)
{
    console.log("Please, provide a password for MongoDB Atlas!");
    process.exit(1);
}

const contact = process.argv.length > 3?{name: process.argv[3], number:process.argv[4]}:null;
if (contact && (!contact.name || !contact.number)) {
    console.log("Please, provide a name and a number!");
    process.exit(1);
}

const dataBase = "phoneBook";
const url = `mongodb+srv://kevapaereo:${password}@fsopen-2025.voojz.mongodb.net/${dataBase}?retryWrites=true&w=majority&appName=fsopen-2025`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const schema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = new mongoose.model("Person", schema);

if (!contact)
{
    let phoneBook = "Phonebook:"
    Person.find({}).then(result => {
        result.forEach(p => {
            phoneBook += (`\n${p.name} ${p.number}`)
        })
        console.log(phoneBook);
        mongoose.connection.close();
    })
}
else
{
    const person = new Person({
        name: contact.name,
        number: contact.number})
    person.save().then(() => {
            console.log("Added", person.name, "number", person.number, "to phonebook");
            mongoose.connection.close();
        }
    )
}