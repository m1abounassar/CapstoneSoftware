'use client'
import { useState, useEffect } from 'react';

function Section({ section, index, moveUp, moveDown }) {
  return (
    <div className='p-4 bg-white rounded-md my-3 shadow-sm hover:bg-[#f0f0f0] flex justify-between items-center'>
      <div className='flex items-center space-x-4'>
        <div className='w-6 h-6 bg-green-300 rounded-full'></div>
        <div>
          <p className='font-bold'>{section.title}</p>
          <div className='text-sm mt-1'>{section.time} | {section.capacity}</div>
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <button onClick={() => moveUp(index)} className='text-xs bg-gray-300 px-3 py-2 rounded'>▲</button>
        <button onClick={() => moveDown(index)} className='text-xs bg-gray-300 px-3 py-2 rounded'>▼</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch("https://jdregistration.sci.gatech.edu/api/auth/session.php")
      .then(response => response.json())
      .then(({ loggedIn, username }) => {
        if (loggedIn === "true" && username) {
          checkAndAddUser(username);
        }
      })
      .catch(error => console.error('Error fetching session:', error));

    fetch("https://jdregistration.sci.gatech.edu/sections.php")
      .then(response => response.json())
      .then(data => setSections(data.sections))
      .catch(error => console.error('Error fetching sections:', error));
  }, []);

  const checkAndAddUser = async (username) => {
    try {
      const checkResponse = await fetch("https://jdregistration.sci.gatech.edu/teams.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkUser", username })
      });
      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        await fetch("https://jdregistration.sci.gatech.edu/teams.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "addUser", username })
        });
      }
    } catch (error) {
      console.error("Error checking or adding user:", error);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updatedSections = [...sections];
    [updatedSections[index], updatedSections[index - 1]] = [updatedSections[index - 1], updatedSections[index]];
    setSections(updatedSections);
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const updatedSections = [...sections];
    [updatedSections[index], updatedSections[index + 1]] = [updatedSections[index + 1], updatedSections[index]];
    setSections(updatedSections);
  };

  return (
    <div className='min-h-screen bg-[#E5E2D3] font-mono'>
      <div className='bg-[#A5925A] grid grid-cols-3 w-681'>
        <div className='p-4 text-lg lg:text-2xl font-sans font-normal w-max text-[#003056]'>
          Junior Design <span className='pt-0 pb-4 pl-0 text-2xl font-sans font-bold text-[#232323]'> Team Sync</span>
        </div>
        <div></div>
        <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056]'>Student</div>
      </div>
      <div className='grid grid-cols-3 gap-10 m-10'>
        <div className='col-span-2'>
          <div className='bg-[#003056] w-full h-min rounded-3xl'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
            <div className='bg-[#E6E6E6] h-full w-full rounded-3xl px-6 py-4 border-5 border-[#003056]'>
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <Section key={section.id} section={section} index={index} moveUp={moveUp} moveDown={moveDown} />
                ))
              ) : (
                <p>Loading sections...</p>
              )}
            </div>
          </div>
        </div>
        <div className='col-span-1'>
          <div className='bg-[#003056] w-full h-min rounded-3xl'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Team Members</div>
            <div className='bg-[#E6E6E6] h-full w-full rounded-3xl px-6 py-4 border-5 border-[#003056]'>
              <p className='text-center text-gray-700'>No team members added yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
