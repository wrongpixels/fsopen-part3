const Entries = ({persons, handleDeletePerson}) => {
    if (!persons || persons.length === 0)
    {
        return(
            <>No contacts yet. Try adding one!</>
        )
    }

    return (
        <ul>
            {
                persons.map(person =>
                    <li key={person.id}><b>{person.name}:</b> {person.number}
                        <button style={{marginLeft: 10}} onClick={() => handleDeletePerson(person.id)}>Delete</button>
                    </li>
                )}
        </ul>
    )
}

export default Entries;