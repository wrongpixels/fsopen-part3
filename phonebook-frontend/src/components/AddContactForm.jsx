const AddContactForm = (props) => {
    return (
        <div>
            <h2>
                Add contact
            </h2>
            <form>
                Name: <input value={props.newName} onChange={props.handleTypeName}/>
                <div>
                    Number: <input value={props.newNumber} onChange={props.handleTypeNumber}/>
                </div>
                <button type="submit" onClick={props.handleAddPerson}>Add</button>
            </form>
        </div>
    )

}
export default AddContactForm;