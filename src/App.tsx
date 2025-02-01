import Navbar from '@/components/shared/Navbar.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Albums from './pages/Albums.tsx';
import Contributors from './pages/Contributors.tsx';
import Projects from './pages/Projects.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className='container mx-auto px-4'>
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
