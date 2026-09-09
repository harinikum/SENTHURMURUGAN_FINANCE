import React from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import RouterComp from './router/RouterComp'

function App() {
  return (
    <BrowserRouter>
      <RouterComp/>
    </BrowserRouter>
  )
}

export default App