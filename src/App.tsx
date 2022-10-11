import './App.css'
import data from './data'

function App() {
  return (
    <div className="App">
    <table>
    {data.map(({name, birthday}) => <tr><td>{name}</td><td>{birthday}</td></tr>)}
</table>
    </div>
  )
}

export default App
