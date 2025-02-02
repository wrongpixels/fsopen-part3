import {useState, useEffect} from 'react'
import AddContactForm from "./components/AddContactForm.jsx";
import Entries from "./components/Entries.jsx";
import Filter from "./components/Filter.jsx";
import phonebookservices from "./services/phonebookservices.js";
import Notification from "./components/Notification.jsx";

function App() {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState({message:'', isError: false});

    useEffect(() => {
        phonebookservices.getContacts().then(result => setPersons(result))
    }, []);

    const handleTypeName = ({target}) => setNewName(target.value);
    const handleTypeNumber = ({target}) => setNewNumber(target.value);
    const handleTypeFilter = ({target}) => setFilter(target.value);
    const activeFilter = filter.toLowerCase();

    const alertMessageSame = `'${newName}' with number ${newNumber} is already in the Phonebook!`
    const alertMessageName = `'${newName}' is already in the Phonebook!\n\nUpdate ${newName}'s number to '${newNumber}'?`;
    const alertMessageNumber = `'${newNumber}' is a already in the Phonebook!\n\nUpdate its contact name to '${newName}'?`;
    const emptyAlert = 'You need to add a Name and a Number!';
    const runNotification = (message, isError = false) => {
        const newNotification = {message, isError};
        setNotification(newNotification);
        setTimeout(() => setNotification({message: '', isError: false}), 5000);
    }
    const runAddError = (name) => {
        runNotification(`Error: '${name}' couldn't be added (server error)`, true);
    }
    const runAccessError = (name) => {
        runNotification(`Error: '${name}' was already removed from the server`, true);
    }

    const resetContactForm = () => {
        setNewNumber('');
        setNewName('');
    }

    const preventSameContact = () => {
        const personExists = persons.find(person => person.name === newName && person.number === newNumber);
        if (personExists) {
            alert(alertMessageSame);
            return true;
        }
        return false;
    }
    const preventSameName = () => {
        const personExists = persons.find(person => person.name === newName);
        if (personExists) {
            if (window.confirm(alertMessageName)) {
                handleEditPerson({...personExists, number: newNumber});
            }
            return true;
        }
        return false;
    }
    const preventSameNumber = () => {
        const personExists = persons.find(person => person.number === newNumber);
        if (personExists) {
            if (window.confirm(alertMessageNumber)) {
                handleEditPerson({...personExists, name: newName});
            }
            return true;
        }
        return false;
    }
    const preventSamePerson = () => preventSameContact() || preventSameName() || preventSameNumber();

    const preventEmpty = () => {
        const emptyName = newName === '';
        const emptyNumber = newNumber === '';
        let message = emptyAlert;
        if (!emptyName && !emptyNumber) {
            return false;
        }
        if (!emptyName) {
            message = 'Number cannot be empty!';
        } else if (!emptyNumber) {
            message = 'Name cannot be empty!';
        }
        alert(message);
        return true;
    }
    const handleAddPerson = (event) => {
        event.preventDefault();
        if (preventEmpty() || preventSamePerson()) {
            return;
        }
        const newPerson = {name: newName, number: newNumber};
        phonebookservices.addNumber(newPerson).then(
            result => {
                setPersons(persons.concat(result))
                runNotification(`Contact '${newName}' was added!`);
                resetContactForm();
            }).catch(() => runAddError(newName))
    }
    const handleEditPerson = (person) => {
        phonebookservices.editContact(person).then(
            result => {
                setPersons(persons.map(existing => existing.id === result.id ? result : existing))
                runNotification(`Contact '${person.name}' was updated!`);
                resetContactForm();
            }
        ).catch(() => {
            runAccessError(person.name);
            removeByID(person.id);
        })
    }

    const handleDeletePerson = (id) => {
        const personToRemove = persons.find(person => person.id === id);
        if (!personToRemove) {
            return;
        }
        const message = `Do you really want to remove '${personToRemove.name}'?`
        if (window.confirm(message)) {
            phonebookservices.deleteNumber(id)
                .then(() => {
            removeByID(id);
            runNotification(`Contact '${personToRemove.name}' was removed`);
        })
                .catch(() => {
                    runAccessError(personToRemove.name);
                    removeByID(id);
                })
        }
    };

    const removeByID = (id) => setPersons(persons.filter(person => person.id !== id));

    const filteredPersons = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(activeFilter));

    return (
        <>
            <h1>Phonebook</h1>
            <Filter filter={filter} handleTypeFilter={handleTypeFilter}/>
            <AddContactForm newName={newName} handleTypeName={handleTypeName} newNumber={newNumber}
                            handleTypeNumber={handleTypeNumber} handleAddPerson={handleAddPerson}/>
            <Notification notification={notification} />

            <h2>Numbers</h2>
            <Entries persons={filteredPersons} handleDeletePerson={handleDeletePerson}/>
        </>
    )
}




export default App 
