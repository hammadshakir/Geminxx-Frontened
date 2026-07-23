
// import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import AddPage from './pages/addPage'
import ViewProject from './pages/viewProject'
import EditProject from './pages/editProject'

function App() {
 

  return (
    <>
  <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<AddPage />} />
      <Route path="/projects/:_id" element={<ViewProject />} />
      <Route path="/projects/:_id/edit" element={<EditProject />} />
    </Routes>
    </>
  )
}

export default App
