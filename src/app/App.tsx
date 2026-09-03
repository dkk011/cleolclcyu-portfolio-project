import { BrowserRouter, Route, Routes } from 'react-router/internal/react-server-client'
import Portfolio from '../pages/Portfolio'
import './App.module.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App