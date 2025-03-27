'use client'
import { useState, useEffect } from 'react';

function Section({ section, index, moveUp, moveDown }) {
  return (
    <div className='p-4 bg-white rounded-md my-3 shadow-sm hover:bg-[#f0f0f0] flex justify-between items-center'>
      <div className='flex items-center space-x-4'>
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

      async function fetchSession() {
        const res = await fetch('/api/auth/session.php');  // Adjust path if needed
        if (res.ok) {
          const session = await res.json();
          console.log('Session:', session);
          setUser(session);  // Save session data to state
        } else {
          console.log('Not logged in');
          window.location.href = '/cas-student.php';  // Redirect to CAS login
        }
      }
  
      fetchSession();
    }, []);

  useEffect(() => {
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

    <div className='h-svh overflow-hidden bg-[#E5E2D3] font-figtree hover:cursor-default'>
      <div className='bg-[#A5925A] grid grid-cols-3 w-681 items-center'>
        <div className='p-4 text-lg lg:text-2xl w-max text-[#003056]'>
          Junior Design <span className='pt-0 pb-4 pl-0 text-2xl font-bold text-[#232323]'> Team Sync</span>
        </div>
        <div></div>
        <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
          
          <div>Student</div>
          <div className='hover:text-[#2b6b9e] hover:cursor-pointer text-xl lg:text-2xl p-0 pb-1'>☰</div>

        </div>



        
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-4 gap-10 m-10'>
        {/* Student Status bar */}
        <div className='col-span-3'>
          <div className='px-8 py-2 lg:py-4 bg-white rounded-2xl p-0 text-black text-sm sm:text-s font-bold'> STUDENT MODE   |   You have not yet submitted your section preferences. The deadline to do so is 12/05/2025. </div>
        </div>
        {/* Leave Team button */}
        <div className='flex flex-col space-y-2'>
          {/* THIS IS A PLACEHOLDER BECAUSE I DON'T KNOW HOW TO NAVIGATE TO THE NEXT PAGE */}
          {/* ALSO WE DON'T EVEN HAVE A NEXT PAGE TO NAVIGATE TO YET */}
          <button onClick={() => moveUp(index)} className='font-bold text-lg bg-[#A5925A] px-3 py-2 rounded hover:bg-[#002040] hover:text-white'>Leave Team</button>
        </div>
      </div>

      <div className='grid grid-cols-5 gap-10 m-10'>
        
        
        {/* Sections Panel */}
        <div className='col-span-1'>
          <div className='bg-[#003056] w-full h-min rounded-3xl'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
            <div className='bg-[#FFFFFF] h-full w-full rounded-b-3xl px-6 py-4 border-5 border-[#003056]'>
            {sections.length > 0 ? (
                  sections.map((section) => (
                    <div key={section.id} className='p-3 bg-[#E5E2D3] rounded-md my-2 shadow-sm text-lg'>
                      <div className='flex gap-2 items-center text-[#003056]'>  {/* row 1 */}
                        <div className='font-bold w-auto'>{section.title}</div>
                        <div className='mr-10'>- {section.time}</div>

                      </div>
                      <div className='flex'>
                        
                        <div className='text-black opacity-40'>{section.capacity} seats remaining</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Loading sections...</p>
                )}
            </div>
          </div>
        </div>



        {/* Team Info Panel */}
        <div className='col-span-3'>
          <div className='bg-[#f0f0f0] w-full rounded-3xl h-5/6 overflow-auto'>
            <div className='px-8 py-2 lg:py-4 text-[#003056] text-lg lg:text-3xl font-bold'>Team Info - 4317</div>
            <div className='bg-[#f0f0f0] h-full w-full rounded-3xl px-6 py-4 border-5 border-[#003056]'>
              <p className='text-left text-gray-700 font-bold'>Team Section Preferences</p>
            </div>
            <div className='grid grid-cols-4 gap-10'>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700'>You</p>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-[#FF7556] rounded-full align-center'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full align-center'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full align-center'></div>
              </div>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700'>Esha Singh</p>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-[#FF7556] rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700'>Jace Walden</p>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700'>Shane Mays</p>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-[#FF7556] rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-[#FFC943] rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700'>Cindy Kwok</p>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700'>Matthew Abernathy</p>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-[#FFC943] rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                <div className='w-6 h-6 bg-green-300 rounded-full'></div>
              </div>
              <div className='cols-span-1'>
                  <p className='text-right text-gray-700 m-4'>Sections:</p>
              </div>
              <div className='cols-span-1'>
                  <p className='text-left text-gray-700 m-4'>Section A</p>
              </div>
              <div className='cols-span-1'>
                  <p className='text-left text-gray-700 m-4'>Section B</p>
              </div>
              <div className='cols-span-1'>
                  <p className='text-left text-gray-700 m-4'>Section C</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
