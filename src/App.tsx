import Navbar from '@/components/Navbar.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Albums from './pages/Albums.tsx';
import Contributors from './pages/Contributors.tsx';
import Projects from './pages/Projects.tsx';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className='flex flex-col h-screen dark:[color-scheme:dark]'>
          <Navbar />
          <div className='flex flex-1 overflow-hidden'>
            <Sidebar />
            <div className='flex flex-col flex-1 overflow-hidden'>
              <Routes>
                <Route path='/' element={<Projects />} />
                <Route path='projects' element={<Projects />} />
                <Route path='albums' element={<Albums />} />
                <Route path='contributors' element={<Contributors />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
