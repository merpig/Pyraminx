import { useState } from 'react';
import './App.css';
import PyraMinx from './components/PyraMinx';
import Navbar from './components/Navbar';

function App() {
  const [reset,setReset] = useState(0);
  return (
    <div className="App">
      <Navbar/>
      <PyraMinx reset={setReset}/>
    </div>
  );
}

export default App;
