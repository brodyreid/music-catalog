import Navbar from '@/components/Navbar.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Albums from './pages/Albums.tsx';
import Contributors from './pages/Contributors.tsx';
import Projects from './pages/Projects.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-col h-screen dark:[color-scheme:dark]'>
        <Navbar />
        <div className='flex overflow-hidden'>
          <Sidebar />
          <div className='flex flex-col flex-1 overflow-hidden'>
            <div className='overflow-auto max-h-screen'>
              <Routes>
                <Route path='/' element={<Projects />} />
                <Route path='projects' element={<Projects />} />
                <Route path='albums' element={<Albums />} />
                <Route path='contributors' element={<Contributors />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
