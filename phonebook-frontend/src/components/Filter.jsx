const Filter = ({filter, handleTypeFilter}) => {
    return (
        <div>
            Filter by name: <input value={filter} onChange={handleTypeFilter}/>
        </div>
    )
}
export default Filter;