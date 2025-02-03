const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
const url = process.env.URI_MONGODB;

mongoose.connect(url).then(()=> console.log("Connected to MongoDB")).catch(error => console.log("Error connecting to MongoDB", error.message));

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
})
personSchema.set('toJSON', {
    transform: (document, returned) => {
        returned.id = returned._id;
        delete returned._id;
        delete returned.__v;
    }
})
module.exports = new mongoose.model("Person", personSchema);