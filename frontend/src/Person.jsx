const Person = ({person, removePerson}) => {
    

    return (
        <>
            
            
                <p>{person.name} : {person.number}</p>
                <button onClick={removePerson}>delete</button>
            
            
        </>
    )
}

export default Person