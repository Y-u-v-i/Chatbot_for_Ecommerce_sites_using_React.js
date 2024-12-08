import { useState } from 'react'
import './App.css'
import image from  './assets/image.png'
import Chatbot from './components/Chatbot'
function App() {
  const [active,setActive] = useState(false)
  return (
    <div className='App'>
     Chatbot
     {
      active ?(<Chatbot setActive={setActive}/>) :(<div className='chatbot-activate' onClick={()=>setActive(true)}>
        <img src={image}/>
      </div>
     )}
    </div>
  )
}

export default App
