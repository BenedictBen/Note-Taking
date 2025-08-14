import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import NoteList from './components/NoteList';
import NoteFormModal from './components/NoteFormModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar onAddNote={() => setIsModalOpen(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <NoteList onAddNote={() => setIsModalOpen(true)} />
      </main>

      <Footer />

      <NoteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;