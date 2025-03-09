'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [sections, setSections] = useState([]);
  const [isAddSectionPopupOpen, setIsAddSectionPopupOpen] = useState(false);
  const [isAddStudentPopupOpen, setIsAddStudentPopupOpen] = useState(false);
  const [isEditStudentPopupOpen, setIsEditStudentPopupOpen] = useState(false);
  const [isRefreshSemesterPopupOpen, setIsRefreshSemesterPopupOpen] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', time: '', capacity: '' });
  const [newStudent, setNewStudent] = useState({ name: '', gtid: '', gtusername: '', team:'' });
  const [rotatedTeams, setRotatedTeams] = useState(new Set());
  const [user, setUser] = useState(null); // NEW: Store user info from CAS session

  // Fetch teams data (If we also move teams to a PHP API, update this)
  useEffect(() => {
    fetch('/teams.json')
      .then(response => response.json())
      .then(data => setTeams(data.teams))
      .catch(error => console.error('Error loading teams:', error));
  }, []);

  // Fetch sections data from PHP API
  useEffect(() => {
    fetch("https://jdregistration.sci.gatech.edu/sections.php")
      .then(response => response.json())
      .then(data => setSections(data.sections))
      .catch(error => console.error("Error loading sections:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  const addOrUpdateSection = () => {
    if (!newSection.title.trim()) return;

    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSection)
    })
    .then(response => response.json())
    .then(() => {
      setSections([...sections, { id: Date.now(), ...newSection }]);
      setNewSection({ title: '', time: '', capacity: '' });
      setIsAddSectionPopupOpen(false);
    })
    .catch(error => console.error('Error updating sections:', error));
  };

  const toggleRotation = (teamId) => {
    setRotatedTeams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "1":
        return '#66D575';
      case "2":
        return '#FFC943';
      case "3":
        return '#FF7556';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "1":
        return "Perfect Fit";
      case "2":
        return "Not ideal";
      case "3":
        return "Does not work";
    }
  };

  return (
    <div className='min-h-screen bg-[#E5E2D3] font-mono'>
      <div className='bg-[#A5925A] grid grid-cols-3 w-screen'>
        <div className='p-4 text-lg lg:text-2xl font-bold w-max text-[#003056]'>Junior Design Team Sync</div>
        <div></div>
        <div className='p-5 text-sm lg:text-lg justify-self-end text-[#003056]'>Student</div>
      </div>

      {/* Body */}
      <div className="grid grid-rows-[fit_fit]">

        {/* Panels */}
        <div className="grid grid-cols-1 m-0">
          
          {/* Left */}
          <div className='m-10'>
            
          </div>

          {/* Teams Panel */}
          <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2 m-10'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Rank the sections</div>
            <div className='bg-[#FFFFFF] h-full w-50 rounded-b-3xl px-5 py-3'>
              <div className='grid grid-cols-12 h-50'>

              </div>
              {sections.length > 0 ? (
                sections.map((sections) => (
                  <div key={sections.id} className='bg-[#E5E2D3] text-[#003056] text-xl rounded-md my-2 shadow-sm grid grid-cols-16'>
                    <div
                      className='p-3 pr-0 text-[#A5925A] hover:text-[#877645] cursor-pointer text-2xl col-start-1 col-end-2'
                      style={{
                        transform: rotatedTeams.has(sections.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                      onClick={() => toggleRotation(sections.id)}>▶
                    </div>     

                    <div key={sections.id}>
                      <p className='font-bold'>{sections.title} - {sections.time}</p>
                      <div className='flex'>
                        <div className='text-sm mr-10'>{50 - sections.capacity} seats remaining</div>
                      </div>
                    </div>

                    <div
                      className='bg-[#DDDDDD] p-3 pr-0 text-[#777777] hover:text-[#877645] text-left cursor-pointer text-2xl col-start-12'
                      style={{
                        transform: rotatedTeams.has(sections.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                      onClick={() => toggleRotation(sections.id)}>▶
                    </div>   

                    <div 
                      className='bg-[#A5925A] rounded-md rounded-l-lg col-start-12 text-center pt-2 text-4xl'
                      style={{
                        color: getStatusColor(sections.status)
                      }}
                      >●</div>
                    <div className='text-sm mr-10'>{getStatusText(sections.status)}</div>

                  </div>
                ))
              ) : (
                <p>Loading sections...</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-5">
              <Button 
                className="bg-[#A5925A] mt-5 text-white text-sm rounded-lg hover:bg-[#80724b] shadow-sm"
                onClick={() => setIsAddStudentPopupOpen(true)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#A5925A] mt-5 text-white text-sm rounded-lg hover:bg-[#80724b] shadow-sm"
                onClick={() => setIsAddStudentPopupOpen(true)}
              >
                Submit
              </Button>
            </div>
      
        </div>
      
      </div>

    </div>
  );
}