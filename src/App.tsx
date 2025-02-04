import Navbar from '@/components/Navbar.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Albums from './pages/Albums.tsx';
import Contributors from './pages/Contributors.tsx';
import Projects from './pages/Projects.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <div className='flex flex-1'>
          <Sidebar />
          <div className='flex flex-col flex-1'>
            <Routes>
              <Route path='/' element={<Projects />} />
              <Route path='/projects' element={<Projects />} />
              <Route path='/albums' element={<Albums />} />
              <Route path='/contributors' element={<Contributors />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
