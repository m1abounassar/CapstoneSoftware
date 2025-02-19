'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [sections, setSections] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [newSection, setNewSection] = useState({ title: '', time: '', capacity: '' });

  useEffect(() => {
    fetch('/teams.json')
      .then(response => response.json())
      .then(data => setTeams(data.teams))
      .catch(error => console.error('Error loading teams:', error));
  }, []);

  useEffect(() => {
    fetch('/sections.json')
      .then(response => response.json())
      .then(data => setSections(data.sections))
      .catch(error => console.error('Error loading sections:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  const addOrUpdateSection = () => {
    if (!newSection.title.trim()) return;
    let updatedSections;
    if (editingSection) {
      updatedSections = sections.map(section => 
        section.id === editingSection.id ? { ...editingSection, ...newSection } : section
      );
    } else {
      updatedSections = [...sections, { id: Date.now(), ...newSection }];
    }
    setSections(updatedSections);
    setNewSection({ title: '', time: '', capacity: '' });
    setIsPopupOpen(false);
    setEditingSection(null);
  };

  const openEditPopup = (section) => {
    setEditingSection(section);
    setNewSection(section);
    setIsPopupOpen(true);
  };

  return (
    <div className='min-h-screen bg-[#E5E2D3] font-mono'>
      <div className='bg-[#A5925A] grid grid-cols-3 w-screen'>
        <div className='p-4 text-lg lg:text-2xl font-bold w-max text-[#003056]'>Junior Design Team Sync</div>
        <div></div>
        <div className='p-5 text-sm lg:text-lg justify-self-end text-[#003056]'>Admin Name</div>
      </div>

      <div className="grid grid-rows-2 md:grid-cols-2">
        <div className='m-10'>
          <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
            <div className='bg-[#E6E6E6] h-full w-50 rounded-3xl px-5 py-3 border-5 border-[#003056]'>
              {sections.length > 0 ? (
                sections.map((section) => (
                  <div key={section.id} className='p-3 bg-white rounded-md my-2 shadow-sm hover:bg-[#f0f0f0] cursor-pointer' onClick={() => openEditPopup(section)}>
                    <p className='font-bold'>{section.title}</p>
                    <div className='flex'>
                      <div className='text-sm mr-10'>{section.time}</div>
                      <div className='text-sm'>{section.capacity}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading sections...</p>
              )}
            </div>
          </div>
          <Button 
            className="bg-[#A5925A] mt-5 text-white text-sm rounded-lg hover:bg-[#80724b] shadow-sm"
            onClick={() => setIsPopupOpen(true)}
          >
            Add Section
          </Button>
        </div>

        <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2 m-10'>
          <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Teams</div>
          <div className='bg-[#E6E6E6] h-full w-50 rounded-3xl px-5 py-3'>
            {teams.length > 0 ? (
              teams.map((team) => (
                <div key={team.id} className='p-3 bg-white rounded-md my-2 shadow-sm hover:bg-[#f0f0f0]'>
                  <p className='font-bold'>{team.id}</p>
                  <p className='text-sm'>{team.project}</p>
                </div>
              ))
            ) : (
              <p>Loading teams...</p>
            )}
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">{editingSection ? 'Edit Section' : 'Add a New Section'}</h2>
            <input 
              name="title" 
              placeholder="Section Title" 
              value={newSection.title}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="time"
              placeholder="Times"
              value={newSection.time}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="capacity"
              placeholder="Capacity"
              value={newSection.capacity}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <div className="flex justify-end mt-5">
              <Button 
                className="bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 shadow-none mr-2"
                onClick={() => { setIsPopupOpen(false); setEditingSection(null); }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-none"
                onClick={addOrUpdateSection}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
