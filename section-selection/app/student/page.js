'use client'
import { useState, useEffect } from 'react';
import { Dropdown } from "@/components/ui/dropdown";
import { DropdownTwo } from "@/components/ui/dropdown2";
export default function Home() {
  const [sections, setSections] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [teams, setTeams] = useState({});
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({});
  const [savePrefOpen, setSavePrefOpen] = useState(false);
  const [teamNumber, setTeamNumber] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  // New state for the name edit popup
  const [nameEditOpen, setNameEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  
  useEffect(() => {
    async function fetchData() {
        const sessionRes = await fetch("https://jdregistration.sci.gatech.edu/api/auth/session.php");
        if (!sessionRes.ok) {
            window.location.href = '/error';
        }
  
        const sessionData = await sessionRes.json();
        console.log('Session:', sessionData);
  
        if (sessionData.loggedIn === 'true') {
            console.log('true');
            setUsername(sessionData.username);
            console.log(sessionData.username);
            const studentsRes = await fetch('https://jdregistration.sci.gatech.edu/students.php');
            if (!studentsRes.ok) throw new Error("Students fetch failed");
        
            const studentsData = await studentsRes.json();
            if (!Array.isArray(studentsData.students)) {
              console.error("Unexpected data format:", studentsData);
              return;
            }
            setAllStudents(studentsData.students);
        
              // Find the student with the matching username
            const matchedStudent = studentsData.students.find(student => student.username.trim().toLowerCase() === sessionData.username.trim().toLowerCase() );
            console.log('info: ');
            console.log(matchedStudent);
        
            if (matchedStudent) {
              console.log(matchedStudent.name);
              setName(matchedStudent.name);
              setNewName(matchedStudent.name); // Initialize newName with current name
              const initialDropdownValues = {};
              
              const firstChoiceArray = JSON.parse(matchedStudent.firstChoice);
              const secondChoiceArray = JSON.parse(matchedStudent.secondChoice);
              const thirdChoiceArray = JSON.parse(matchedStudent.thirdChoice);
              // Assign priorities from student's choices
              firstChoiceArray.forEach((section) => {
                initialDropdownValues[section] = "1";
              });
              secondChoiceArray.forEach((section) => {
                initialDropdownValues[section] = "2";
              });
              thirdChoiceArray.forEach((section) => {
                initialDropdownValues[section] = "3";
              });
          
              dropdownValues = initialDropdownValues;
              setDropdownValues(dropdownValues);
              console.log("inital:", initialDropdownValues);
              console.log("actual:", dropdownValues);
              console.log(Object.keys(dropdownValues));
              console.log(Object.values(dropdownValues));
              console.log(dropdownValues['JIF']);
              console.log("im so sad: ", matchedStudent.team);
              teamNumber = matchedStudent.team;
              setTeamNumber(teamNumber);
              const teamsRes = await fetch('https://jdregistration.sci.gatech.edu/actualTeams.php');
              if (!teamsRes.ok) throw new Error("Team fetch failed");
                  
              const teamData = await teamsRes.json();
              if (!Array.isArray(teamData.teams)) {
                  console.error("Unexpected data format:", teamData);
                  return;
              }
                  
              // Find the student with the matching username
              console.log("Team Number: ", teamNumber);
              const matchedTeam = teamData.teams.find(team => team.name === teamNumber);
              console.log(matchedTeam);
              
               if (matchedTeam) {
                  teams = matchedTeam; // Store the entire matched team in state
                  setTeams(teams);
              
                  const rawTeamMembers = JSON.parse(matchedTeam.members); // Now access members safely
                  console.log("Team: ", teams, "Raw Team Members: ", rawTeamMembers);
                  console.log(typeof rawTeamMembers);
                  console.log(typeof allStudents);
                  rawTeamMembers.forEach((person) => {
                    const currStudent = studentsData.students.find(student => student.gtID === person);
                    console.log("Person", person, "Curr Student: ", currStudent);
              
                    setTeamMembers(prev => ({
                      ...prev, 
                      [currStudent.name]: { firstChoice: currStudent.firstChoice, secondChoice: currStudent.secondChoice, thirdChoice: currStudent.thirdChoice, }
                      }));
                      console.log(teamMembers);
                    });
                    console.log(teamMembers);
              } else {
                  console.log("naur!");
              }
              
            } else {
              console.error("Student not found in the list.");
              window.location.href = '/notFound';
            }
          
        } else {
          window.location.href = '/cas-student.php';
        }
  
    
    }
  
    fetchData();
  }, []);
  

  
  useEffect(() => {
    fetch("https://jdregistration.sci.gatech.edu/sections.php")
      .then(response => response.json())
      .then(data => {
        sections = data.sections;
        setSections(sections);
        console.log(sections);
        console.log(typeof sections);
        
        // Log dropdownValues for each section
        data.sections.forEach(section => {
          console.log(`Dropdown value for ${section.title}:`, dropdownValues[section.title]);
        });
      })
      .catch(error => console.error('Error fetching sections:', error));
  }, [dropdownValues]);
  
  const handlePriorityChange = (sectionName, newValue) => {
    setPriorities((prev) => ({
      ...prev,
      [sectionName]: newValue, // Set priority based on section title
    }));
  
    setDropdownValues((prev) => ({
      ...prev,
      [sectionName]: newValue, // Update the dropdown value
    }));
  };
  const handleSavePreferences = async () => {
    setSavePrefOpen(!savePrefOpen);
    
    // Create arrays for each priority (first, second, third)
    const preferences = {
      firstChoice: [],
      secondChoice: [],
      thirdChoice: []
    };
  
    sections.forEach((section) => {
      const priority = priorities[section.title] || "3";  // Default to "3" if not selected
  
      if (priority === "1") {
        preferences.firstChoice.push(section.title); // Add to firstChoice array
      } else if (priority === "2") {
        preferences.secondChoice.push(section.title); // Add to secondChoice array
      } else {
        preferences.thirdChoice.push(section.title); // Add to thirdChoice array
      }
    });
  
    console.log(preferences.firstChoice, preferences.secondChoice, preferences.thirdChoice);
  
    const postData = {
      username,
      firstChoice: preferences.firstChoice,
      secondChoice: preferences.secondChoice,
      thirdChoice: preferences.thirdChoice,
    };
      
    console.log(postData);
  
  
    try {
      const response = await fetch("https://jdregistration.sci.gatech.edu/students.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
  
      const textResponse = await response.text();  // Get the raw response as text
      console.log("Raw response from server:", textResponse);  // Log the response text
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${textResponse}`);
      }
  
      const result = JSON.parse(textResponse);  // Try to parse it as JSON
      console.log(result);  // Log the parsed result
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };
  // New function to save the updated name
  const handleSaveName = async () => {
  if (!newName.trim()) {
    return; // Don't save empty names
  }
  
  try {
    const postData = {
      username,
      name: newName
    };
    
    const response = await fetch("https://jdregistration.sci.gatech.edu/students.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    
    const textResponse = await response.text();
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${textResponse}`);
    }
    
    // Update the name in the UI
    setName(newName);
    // Close the popup
    setNameEditOpen(false);
  } catch (error) {
    console.error("Error updating name:", error);
  }
};

  
  // useEffect(() => {
  //   const fetchStudentData = async () => {
  //     try {
  //       const response = await fetch("/students.php");
  //       const data = await response.json();
  //       const student = data.find((s) => s.username === username);
  //       if (student) {
  //         setSelectedChoice(student.firstChoice || "3"); // Default to "3" if not found
  //       }
  //     } catch (error) {
  //       console.error("Error fetching student data:", error);
  //     }
  //   };
  //   fetchStudentData();
  // }, [username]);

  
  useEffect(() => {
    console.log("Updated Team Members:", teamMembers);
    console.log(typeof teamMembers);
    console.log(Object.keys(teamMembers).length);
  }, [teamMembers]);
  useEffect(() => {
    console.log("Updated Dropdown Values:", dropdownValues);
  }, [dropdownValues]);
  

  return (
    <div className='min-h-screen bg-[#E5E2D3] font-figtree'>
      <div className='bg-[#A5925A] grid grid-cols-3 w-screen items-center'>
        <div className='p-4 text-lg lg:text-2xl font-bold w-max text-[#003056]'>Junior Design Team Sync</div>
        <div></div>
        <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
          
          <div>Admin</div>
          <button
                onClick={() => setHamburgerOptionsOpen(!hamburgerOptionsOpen)}
                className="flex hover:text[#054171] items-center justify-center text-2xl font-bold px-3 py-1 transition-all focus:outline-none">
          ☰</button>
      
      </div>

      <div className='h-svh overflow-hidden bg-[#E5E2D3] font-figtree hover:cursor-default flex flex-col'>

      <div className='bg-[#A5925A] grid grid-cols-3 w-681 items-center px-10'>
            <div className='p-4 text-lg lg:text-2xl w-max text-[#232323] font-bold'>
              Team Sync <span className='pt-0 pb-4 pl-0 text-lg font-normal text-[#003056]'> for Junior Design</span>
            </div>
            <div></div>
            <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
              
              <div className="flex items-center gap-2">
                <div>{name}</div>
                
              </div>
  
              <button
                onClick={() => setHamburgerOptionsOpen(!hamburgerOptionsOpen)}
                className="flex items-center justify-center text-2xl font-bold px-3 py-1 transition-all focus:outline-none">
                ☰</button>

            </div>
      
      </div>

      {/* Body */}
      <div className="grid grid-rows-[fit_fit]">

        {/* Header */}
        <div className="grid grid-cols-2 mt-5 mx-10 w-9/10 h-fit">

          <div className='flex justify-center rounded-xl bg-[#FFFFFF]'>

            <div className='py-3 font-bold'>ADMIN MODE | 104/250 </div>

            <div className='py-3 pl-2'> Registered Students have been assigned a section</div>


          </div>

          <div className='flex justify-around rounded-lg self-center text-white text-md rounded-lg'>

            <Button 
              className="bg-[#A5925A] hover:bg-[#80724b]"
              onClick={() => setIsAddStudentPopupOpen(true)}
            >
              Add Student
            </Button>

            <Button 
              className="bg-[#A5925A] hover:bg-[#80724b]"
              onClick={() => setIsEditStudentPopupOpen(true)}
            >
              Edit Student
            </Button>

            <Button 
              className="bg-[#A5925A] hover:bg-[#80724b] w-2xl"
              onClick={() => setIsRefreshSemesterPopupOpen(true)}
            >
              Refresh Semester
            </Button>



          </div>



        </div>


        {/* Panels */}
        <div className="grid grid-cols-2 m-0">
          
          {/* Left */}
          <div className='m-10'>
            
            
            {/* Sections Panel */}
            <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2'>
              <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
              <div className='bg-[#FFFFFF] h-full w-50 rounded-b-3xl px-5 py-3 border-5 border-[#003056]'>
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <div key={section.id} className='p-3 pl-5 bg-[#E5E2D3] flex rounded-md my-2 shadow-sm text-lg items-center'>
                      <div className='flex flex-col'>

                          <div className='flex gap-2 items-center text-[#003056]'>  {/* row 1 */}
                            <div className='font-bold w-auto'>{section.title}</div>
                            <div className='mr-10'>- {section.time}</div>

                          </div>
                          <div className='flex'>
                            
                            <div className='text-black opacity-40'>{section.capacity} seats remaining</div>
                          </div>
                      </div>

                      <div className='flex justify-items-end'>
                        <button className='bg-[url("/pencil.png")] hover:bg-[url("/pencilHover.png")] bg-contain bg-no-repeat h-8 w-9'></button>
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
              onClick={() => setIsAddSectionPopupOpen(true)}
            >
              Add Section
            </Button>

          </div>

          {/* Teams Panel */}
          <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2 m-10'>
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Teams</div>
            <div className='bg-[#FFFFFF] h-full w-50 rounded-b-3xl px-5 py-3'>
              <div className='grid grid-cols-12 h-50'>

                <div className='mb-3 col-start-1 col-end-12 grid grid-cols-8'>
                  <input
                    className='border-[#B4B2B2] border-2 rounded-l-lg text-lg p-2 col-start-1 col-end-8'
                    placeholder='Search by Team Name or Number'
                  
                  
                  />

                  <div className='bg-[#D9D9D9] border-[#B4B2B2] border-2 border-l-0 text-4xl w-fit px-4 rounded-r-md hover:text-[#525252] cursor-pointer col-start-8 col-span-1'>⌕</div>
                </div>
                
                
                <div className='bg-[#D9D9D9] border-[#B4B2B2] border-2 col-start-12 font-bold text-xl w-fit h-12 rounded-lg py-2 px-4 hover:text-[#525252] cursor-pointer justify-self-end'>λ</div>


              </div>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team.id} className='bg-[#E5E2D3] text-[#003056] text-xl rounded-md my-2 shadow-sm grid grid-cols-16'>
                    <div
                      className='p-3 pr-0 text-[#A5925A] hover:text-[#877645] cursor-pointer text-2xl col-start-1 col-end-2'
                      style={{
                        transform: rotatedTeams.has(team.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                      onClick={() => toggleRotation(team.id)}>▶
                    </div>     
                    <div className='font-bold pt-3.5 col-start-2 col-end-12'>{team.id}</div>
                    <div 
                      className='bg-[#A5925A] rounded-md rounded-l-lg col-start-12 text-center pt-2 text-4xl'
                      style={{
                        color: getStatusColor(team.status)
                      }}
                      >●</div>
                  </div>
                ))
              ) : (
                <p>Loading teams...</p>
              )}
            </div>
          </div>
      
        </div>
      
      </div>

      {/* Pop-up Modal for Adding Section */}
      {isAddSectionPopupOpen && (
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
                onClick={() => setIsAddSectionPopupOpen(false)}
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

      {/* Pop-up Modal for Adding Student */}
      {isAddStudentPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">Add a New Student</h2>
            <input 
              name="name" 
              placeholder="George Burdell" 
              value={newSection.name}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="gtid"
              placeholder="903XXXXXX"
              value={newSection.gtid}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="gtusername"
              placeholder="gburdell3"
              value={newSection.gtusername}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="team"
              placeholder="1234"
              value={newSection.team}
              onChange={handleInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <div className="flex justify-end mt-5">
              <Button 
                className="bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 shadow-none mr-2"
                onClick={() => setIsAddStudentPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-none"
                onClick={addStudent}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Modal for Adding Section */}
      {isEditStudentPopupOpen && (
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
                onClick={() => setIsEditStudentPopupOpen(false)}
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

      {/* Pop-up Modal for Adding Section */}
      {isRefreshSemesterPopupOpen && (
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
                onClick={() => setIsRefreshSemesterPopupOpen(false)}
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


      {hamburgerOptionsOpen && (
            <div className="absolute right-0 mt-20 mr-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div
                onClick={() => {
                  setSettingsOpen(true);
                  setHamburgerOptionsOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100 text-center"
              >
                Settings
              </div>
              <div
                onClick={() => {
                  setLogoutOpen(true);
                  setHamburgerOptionsOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100 text-center text-[#D01717]"
              >
                Logout
              </div>
            </div>
      )}

      {logoutOpen && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Are You Sure?</h2>

              <div className='flex gap-5 justify-center font-bold'>

                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      startLogout();
                    }}
                    className="mt-4 px-4 py-2 bg-[#D01717] hover:bg-[#EA2020] text-white rounded-md"
                  >
                    Logout
                  </button>
              </div>



            </div>
            
        </div>
      )}


      {(settingsOpen && (isLeadAdmin == false)) && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="grid grid-rows-4">

              <div className='flex items-center'>
                <label className="font-bold w-1/3 mr-1">Name:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter Name"
                  className="border border-gray-300 p-2 rounded-md w-2/3"
                />
              </div>


              
      
              <div className="flex justify-between items-center">
                <label className="font-bold w-1/3">GTID:</label>
                <span className="w-2/3 text-right">{gtid}</span>
              </div>
      
              <div className="flex justify-between items-center">
                <label className="font-bold w-1/3">Username:</label>
                <span className="w-2/3 text-right">{username}</span>
              </div>

              <div className='flex gap-5 justify-center font-bold'>

                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleSaveName();
                      setSettingsOpen(false);
                    }}
                    className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                  >
                    Save
                  </button>
              </div>

            </div>


            </div>
            
        </div>
      )}

      {(settingsOpen && (isLeadAdmin == true)) && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white grid grid-cols-2 gap-4 p-6 rounded-md shadow-lg w-max h-max text-center">

            <div>

                    <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                    <div className="grid grid-rows-4">

                      <div className='flex items-center'>
                        <label className="font-bold w-1/3 mr-1">Name:</label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Enter Name"
                          className="border border-gray-300 p-2 rounded-md w-2/3"
                        />
                      </div>


                      
              
                      <div className="flex justify-between items-center">
                        <label className="font-bold w-1/3">GTID:</label>
                        <span className="w-2/3 text-right">{gtid}</span>
                      </div>
              
                      <div className="flex justify-between items-center">
                        <label className="font-bold w-1/3">Username:</label>
                        <span className="w-2/3 text-right">{username}</span>
                      </div>

                      <div className='flex gap-5 justify-center font-bold'>

                          <button
                            onClick={() => setSettingsOpen(false)}
                            className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                          >
                            Close
                          </button>
                          <button
                            onClick={() => {
                              handleSaveName();
                              setSettingsOpen(false);
                            }}
                            className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                          >
                            Save
                          </button>
                      </div>

                    </div>
                </div>

                <div>

                    <h2 className="text-xl font-bold mb-4">Admin Settings</h2>

                    <div className='overflow-auto'>

                    {Object.keys(allAdmin).length > 0 ? (
                      Object.keys(allAdmin).map(([name]) => (
                        <div key={name} className='text-[#003056] text-xl my-2 grid grid-cols-8'>

                          <div>{name}</div>
                          

                        </div>
                      ))
                    ) : (
                      <p>Loading Admin...</p>
                    )}


                    </div>

                    
                    <div className='flex gap-5 justify-center font-bold'>

                          <button
                            onClick={() => {
                              handleSaveName();
                              setSettingsOpen(false);
                            }}
                            className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                          >
                            Add an Admin
                          </button>
                     </div>

                    </div>

                </div>


            </div>
            
      )}

        {/* CSV Upload Section */}
        <div className="m-10">
          <input 
            type="file" 
            id="csvFileInput" 
            accept=".csv" 
            style={{ display: "none" }} 
            onChange={handleCSVUpload} 
          />
          <Button
            className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-sm"
            onClick={() => document.getElementById("csvFileInput").click()}
          >
            Upload CSV
          </Button>
        </div>

      </div>

    </div>

    </div>

  
  );
}
