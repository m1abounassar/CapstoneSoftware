'use client'
import { useState, useEffect } from 'react';
import { Dropdown } from "@/components/ui/dropdown";
import { DropdownTwo } from "@/components/ui/dropdown2";

export default function Home() {
  const [sections, setSections] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [teams, setTeams] = useState([]);
  const [username, setUsername] = useState([]);
  const [name, setName] = useState("");
  const [dropdownValues, setDropdownValues] = useState({});
  

  useEffect(() => {
      async function fetchSession() {
        const res = await fetch("https://jdregistration.sci.gatech.edu/api/auth/session.php");  // Adjust path if needed
        if (res.ok) {
          const session = await res.json();
          console.log('Session:', session);
          if (session.loggedIn === 'true') {
            setUsername(session.username);
          } else {
            window.location.href = '/cas-student.php';
          }
        } else {
          window.location.href = '/cas-student.php';
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

  useEffect(() => {
    fetch("https://jdregistration.sci.gatech.edu/actualTeams.php")
      .then(response => response.json())
      .then(data => setTeams(data.teams))
      .catch(error => console.error('Error fetching sections:', error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const studentsResponse = await fetch('https://jdregistration.sci.gatech.edu/students.php');
        const studentsData = await studentsResponse.json();
  
        if (studentsData.students) {
          // Find the student with the matching username
          const matchedStudent = studentsData.students.find(student => student.username === username);
  
          console.log(matchedStudent ? matchedStudent.name : 'Student not found');
          console.log(matchedStudent.name);
  
          if (matchedStudent) {
            setName(matchedStudent.name);
          } else {
            window.location.href = '/notFound';
          }
        } else {
          console.error("Unexpected data format: ", studentsData);
        }

    };
  
    fetchData();
  }, []);

  const handlePriorityChange = (index, newValue) => {
    setPriorities((prev) => ({
      ...prev,
      [index]: newValue,
    }));
  };

  const handleSavePreferences = async () => {
    // Create arrays for each priority (first, second, third)
    const preferences = {
      firstChoice: [],
      secondChoice: [],
      thirdChoice: []
    };

    // Iterate over the sections and assign them to the respective priority
    sections.forEach((section, index) => {
      const priority = priorities[index] || "3";  // Default to "3" if not selected

      if (priority === "1") {
        preferences.firstChoice.push(section.title); // Add to firstChoice array
      } else if (priority === "2") {
        preferences.secondChoice.push(section.title); // Add to secondChoice array
      } else {
        preferences.thirdChoice.push(section.title); // Add to thirdChoice array
      }
    });

    const postData = {
      username,
      firstChoice: preferences.firstChoice,
      secondChoice: preferences.secondChoice,
      thirdChoice: preferences.thirdChoice,
    };

    try {
      const response = await fetch("path-to-your-php-endpoint.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };



return (
  <div className='h-svh overflow-hidden bg-[#E5E2D3] font-figtree hover:cursor-default flex flex-col'>

      <div className='bg-[#A5925A] grid grid-cols-3 w-681 items-center px-10'>
            <div className='p-4 text-lg lg:text-2xl w-max text-[#003056]'>
              Junior Design <span className='pt-0 pb-4 pl-0 text-2xl font-bold text-[#232323]'> Team Sync</span>
            </div>
            <div></div>
            <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
              
              <div>{name}</div>
  
              <DropdownTwo/>

            </div>
        
      </div>



      {/* Below Header */}
      <div className='grid grid-rows-14 gap-8 h-[100%] m-10 mb-15'>

          {/* Panels */}
          <div className='row-span-12 grid grid-cols-5 gap-10'>



              {/* Sections */}
              <div className='col-span-2 bg-[#003056] h-[100%] rounded-3xl flex flex-col'>

                  <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>


                  <div className='bg-[#FFFFFF] h-full w-full rounded-b-3xl px-6 py-4 border-5 border-[#003056] overflow-auto'>
                      {sections.length > 0 ? (
                        sections.map((section) => (
                          <div key={section.id} className='p-3 pl-6 bg-[#E5E2D3] rounded-md my-2 shadow-sm text-lg grid grid-cols-2 items-center'>
                            <div>
                                <div className='flex gap-2 items-center text-[#003056]'>  {/* row 1 */}
                                  <div className='font-bold w-auto'>{section.title}</div>
                                  <div className='mr-10'>- {section.time}</div>

                                </div>
                                <div className='flex'>
                                  
                                  <div className='text-black opacity-40'>{section.capacity} seats remaining</div>
                                </div>
                            </div>


                            <Dropdown
                              sectionName={section.title}
                              value={dropdownValues[section.title] || "3"} // Use stored value or default to "3"
                              onChange={handlePriorityChange}
                            />
                  


                          </div>
                        ))
                      ) : (
                        <p>Loading sections...</p>
                      )}

                  </div>


              </div>


              {/* Team */}
              <div className='col-span-3 bg-[#003056] rounded-3xl h-[100%] flex flex-col'>

                  <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Team Info</div>

                  <div className='bg-[#FFFFFF] h-full w-full rounded-b-3xl px-6 py-4 border-5 border-[#003056] overflow-auto'>
                      {teams.length > 0 ? (
                            teams.map((team) => (
                              <div key={team.name}>

                                  <div className='flex pb-3 border-b-2 border-[#A5925A] text-xl text-[#003056]'>

                                    <div className='font-bold text-nowrap'>Team {team.name} - </div>

                                    <div className=' ml-1 text-nowrap'>{team.projectName}</div>

                                    <div className='flex w-full justify-end'>
                                      <div className='font-bold'>Client:</div>
                                      <div className='ml-1'>{team.clientName}</div>
                                    </div>


                                  </div>



                                  
                                
                              </div>
                            ))
                          ) : (
                            <p>Loading team...</p>
                          )
                      }
                  </div>


              </div>

          </div>



    

          {/* Buttons */}
          <div className='row-span-1 grid grid-cols-10'>


              <button className='col-span-2 text-[#003056] font-bold text-2xl bg-[#A5925A] px-3 py-2 mt-0 rounded-3xl hover:bg-[#003056] hover:text-white' onClick={handleSavePreferences}>Save Preferences</button>

              <button className='col-span-2 text-[#003056] col-start-9 font-bold text-2xl bg-[#A5925A] px-3 py-2 mt-0 rounded-3xl hover:bg-[#003056] hover:text-white'>Leave Team</button>


          </div>



        
      </div>


  </div>
  );
}
