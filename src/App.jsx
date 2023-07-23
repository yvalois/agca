import { useState } from 'react'
import { BrowserRouter, Routes,Route, HashRouter } from 'react-router-dom'
import Administrador from './Administrador'

import './App.css'
import Connect from './Connect'
import Form from './Form'
import Ico from './Ico'
import Layout from './Layout'

function App() {


  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<Connect/>}/>
          <Route path="/connect/:refer" element={<Connect/>}/>
          <Route path='/connect' index element={<Connect/>}/>
          <Route path='/form' element={<Form/>}/>
          <Route path="/ico" element={<Ico/>}/>
          <Route path="/admin" element={<Administrador/>}/>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
