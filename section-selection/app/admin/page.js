'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [sections, setSections] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', time: '', capacity: '' });

  // Fetch teams data (If we also move teams to a PHP API, update this)
  useEffect(() => {
    fetch('/teams.json')
      .then(response => response.json())
      .then(data => setTeams(data.teams))
      .catch(error => console.error('Error loading teams:', error));
  }, []);

  // Fetch sections data from PHP API
  useEffect(() => {
    fetch('http://jdregistration.sci.gatech.edu/sections.php')
      .then(response => response.json())
      .then(data => setSections(data.sections))
      .catch(error => console.error('Error loading sections:', error));
  }, []);

  // Handle input change for new section
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  // Add new section - Save to PHP backend
  const addSection = () => {
    if (!newSection.title.trim()) return;

    fetch('http://jdregistration.sci.gatech.edu/sections.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSection)
    })
    .then(response => response.json())
    .then(() => {
      setSections([...sections, { id: Date.now(), ...newSection }]);
      setNewSection({ title: '', time: '', capacity: '' });
      setIsPopupOpen(false);
    })
    .catch(error => console.error('Error updating sections:', error));
  };

  return (
    <div className='min-h-screen bg-[#E5E2D3] font-mono'>

      {/* Header */}
      <div className='bg-[#A5925A] grid grid-cols-3 w-681'>
        <div className='p-4 text-lg lg:text-2xl font-sans font-normal w-max text-[#003056]'>
          Junior Design <span className='pt-0 pb-4 pl-0 text-2xl font-sans font-bold text-[#232323]'> Team Sync</span>
        </div>
        <div></div>
        <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056]'>Admin Name</div>
      </div>

      {/* Panels */}
      <div className="grid grid-rows-2 md:grid-cols-2">
        
        {/* Sections Panel */}
        <div className='m-10'>
          <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
            <div className='bg-[#E6E6E6] h-full w-50 rounded-3xl px-5 py-3 border-5 border-[#003056]'>
              {sections.length > 0 ? (
                sections.map((section) => (
                  <div key={section.id} className='p-3 bg-white rounded-md my-2 shadow-sm hover:bg-[#f0f0f0]'>
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

        {/* Teams Panel */}
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

      {/* Pop-up Modal for Adding Section */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">Add a New Section</h2>
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
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-none"
                onClick={addSection}
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
