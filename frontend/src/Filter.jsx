
const Filter = ({text, setter}) => {

    const handleFilterChange = (event) => {
        setter(event.target.value)
      }

    return (
        <div>
            filter by name <input onChange={handleFilterChange} value={text}/>
        </div>
    )
}

export default Filter