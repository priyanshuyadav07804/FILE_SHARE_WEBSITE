import React from 'react'
import { BrowserRouter,Route,Routes, } from 'react-router-dom'
import Upload from './Components/Upload'
import Download from './Components/Download'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Upload/>}/>
      <Route path='/files/:uuid' element={<Download/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
