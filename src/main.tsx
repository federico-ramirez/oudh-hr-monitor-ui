import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import Nav from './components/Nav/Nav'
import Footer from './components/Footer/Footer'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path='/' Component={Home} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)
