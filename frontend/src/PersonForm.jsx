
const PersonsForm = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber, addPerson}) => {

      //functie on change
      const handleNameChange = (event) => {
        //console.log(event.target.value)
        setNewName(event.target.value)
      }
    
      const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
      }
    
      const handleFilterChange = (event) => {
        setFilter(event.target.value)
      }
    

    return (
        <form onSubmit={addPerson}>
        <div>
          <h2>Add a new</h2>
          name: <input onChange={handleNameChange} value={newName}/>
          number: <input onChange={handleNumberChange} value={newNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonsForm