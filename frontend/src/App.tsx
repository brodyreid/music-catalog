import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Albums from './components/Albums.tsx';
import Contributors from './components/Contributors.tsx';
import Navbar from './components/Navbar.tsx';
import Projects from './components/Projects.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path='/' element={<Projects />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/albums' element={<Albums />} />
          <Route path='/contributors' element={<Contributors />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
