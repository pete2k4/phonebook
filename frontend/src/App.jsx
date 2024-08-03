import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonsForm from './PersonForm'
import Person from './Person'
import axios from 'axios'
import personServices from './services/persons'
import Notification from './Notification'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({message: '', type: ''})

  useEffect(() => {
    personServices
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  

  const addPerson = async (event) => {
    event.preventDefault();
  
    const personObject = {
      name: newName,
      number: newNumber,
    };
  
    
    const duplicatePerson = await checkDuplicates(); // Wait for the duplicate check

    if (duplicatePerson) {
      if (window.confirm(`${newName} is already in phonebook. Replace the new number?`)) {
        const changedPerson = { ...duplicatePerson, number: newNumber };
        updatePerson(changedPerson.id, changedPerson);
        setNotification({ message: `${newName} was updated`, type: 'positive' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      }
    } else {
      const response = await personServices.create(personObject); // Add new person
      setPersons(persons.concat(response.data));
      setNotification({ message: `${newName} was added to the phonebook`, type: 'positive' });
      
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }

    setNewName('');
    setNewNumber('');
    
  };
  

  const updatePerson = (id, newObject) => {
    personServices
      .update(id, newObject)
      .then(response => {
        setPersons(persons.map(n => n.id !== id ? n : response.data))
      })
  }

  const checkDuplicates = async () => {
    const response = await personServices.getAll(); // Fetch the latest data from the server
    const serverPersons = response.data;
    return serverPersons.find((person) => person.name === newName);
  };
  

  const removePerson = async (id) => {
    const person = persons.find(n => n.id === id);
    console.log(person);
  
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      try {
        await personServices.remove(person.id); // Await the removal
        const newPersons = persons.filter(person => person.id !== id);
        setPersons(newPersons);
      } catch (error) {
        setNotification({ message: `Couldn't delete ${person.name} from the phonebook`, type: 'negative' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      }
    }
  };
  
  
  const personsToShow = persons.filter((person) => person.name.toLowerCase().startsWith(filter))
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text={filter} setter={setFilter}/>
      <PersonsForm 
        persons={persons} setPersons={setPersons} 
        newName={newName} setNewName={setNewName}
        newNumber={newNumber} setNewNumber={setNewNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Notification notification={notification}/>
      {personsToShow.map(person => 
        <Person person={person}  removePerson={() => removePerson(person.id)}/>
      )}
      
    </div>
  )
}

export default App