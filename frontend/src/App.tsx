import AlbumList from '@/components/Albums/AlbumList.tsx';
import ProjectList from '@/components/Catalog/CatalogList.tsx';
import ContributorList from '@/components/Contributors/ContributorList.tsx';
import Navbar from '@/components/shared/Navbar.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto px-12">
        <Routes>
          <Route path='/' element={<ProjectList />} />
          <Route path='/projects' element={<ProjectList />} />
          <Route path='/albums' element={<AlbumList />} />
          <Route path='/contributors' element={<ContributorList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
