import { useState, useEffect } from 'react';
import Filter from './Filter';
import PersonsForm from './PersonForm';
import Person from './Person';
import axios from 'axios';
import personServices from './services/persons';
import Notification from './Notification';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    };

    if (checkDuplicates()) {
      if (window.confirm(`${newName} is already in phonebook. replace the new number?`)) {
        const person = persons.find((person) => person.name === newName);
        const changedPerson = { ...person, number: newNumber };
        updatePerson(changedPerson.id, changedPerson);
      }
    } else {
      personServices
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNotification({ message: `${newName} was added to the phonebook`, type: 'positive' });  // <-- Set notification

          setTimeout(() => {
            setNotification({ message: '', type: '' });  // <-- Clear notification after 5 seconds
          }, 5000);
        });
    }

    setNewName('');
    setNewNumber('');
  };

  const updatePerson = (id, newObject) => {
    personServices
      .update(id, newObject)
      .then(response => {
        setPersons(persons.map(n => n.id !== id ? n : response.data));
        setNotification({ message: `${newObject.name}'s number was updated`, type: 'positive' });  // <-- Set notification

        setTimeout(() => {
          setNotification({ message: '', type: '' });  // <-- Clear notification after 5 seconds
        }, 5000);
      });
  };

  const checkDuplicates = () => {
    return persons.some((person) => person.name === newName);
  };

  const removePerson = (id) => {
    const person = persons.find(n => n.id === id);
    if (window.confirm(`are you sure you want to delete ${person.name}?`)) {
      personServices
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification({ message: `${person.name} was removed from the phonebook`, type: 'negative' });  // <-- Set notification

          setTimeout(() => {
            setNotification({ message: '', type: '' });  // <-- Clear notification after 5 seconds
          }, 5000);
        });
    }
  };

  const personsToShow = persons.filter((person) => person.name.toLowerCase().startsWith(filter));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text={filter} setter={setFilter} />
      <PersonsForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Notification message={notification.message} type={notification.type} />  
      {personsToShow.map(person => (
        <Person key={person.id} person={person} removePerson={() => removePerson(person.id)} />
      ))}
    </div>
  );
};

export default App;
