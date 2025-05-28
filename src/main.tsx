import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import Nav from './components/Nav/Nav'
import Footer from './components/Footer/Footer'
import Results from './pages/Results/Results'
import Results2 from './pages/Results/Results2'
import NotFound from './pages/NotFound/NotFound';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path='/' Component={Home} />
      <Route path='/results' Component={Results} />
      <Route path='/results2' Component={Results2} />
      <Route path='/*' Component={NotFound} />
    </Routes>
    <Footer />
  </BrowserRouter>
)
