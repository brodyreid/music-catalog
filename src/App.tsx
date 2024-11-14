import ProjectsSearch from "./components/ProjectsSearch.tsx";

export default function App() {
  return (
    <>
      <div className="flex items-center gap-1">
        <img src="/logo.svg" alt="logo" className="w-12 h-12 m-4" />
        <h2 className="text-[#9D74B3]">music_catalog</h2>
      </div>
      <div className="container mx-auto mt-12">
        <ProjectsSearch />
      </div>
    </>
  );
}
