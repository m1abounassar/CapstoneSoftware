'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownTwo } from "@/components/ui/dropdown2";

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [sections, setSections] = useState([]);
  const [isAddSectionPopupOpen, setIsAddSectionPopupOpen] = useState(false);
  const [isAddStudentPopupOpen, setIsAddStudentPopupOpen] = useState(false);
  const [isEditStudentPopupOpen, setIsEditStudentPopupOpen] = useState(false);
  const [isRefreshSemesterPopupOpen, setIsRefreshSemesterPopupOpen] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', time: '', capacity: '' });
  const [newStudent, setNewStudent] = useState({ name: '', gtid: '', gtusername: '', team:'' });
  const [rotatedTeams, setRotatedTeams] = useState(new Set());
<<<<<<< Updated upstream
  const [user, setUser] = useState(null); // NEW: Store user info from CAS session
=======
  const [nameEditOpen, setNameEditOpen] = useState(false);
  const [hamburgerOptionsOpen, setHamburgerOptionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [username, setUsername] = useState("");
  const [gtid, setGTID] = useState(0);
  const [allAdmin, setAllAdmin] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allTeams, setAllTeams] = useState({});
  const [isLeadAdmin, setIsLeadAdmin] = useState(true);
>>>>>>> Stashed changes

  const [protocol, setProtocol] = useState("http://");

  useEffect(() => {
    setProtocol(window.location.protocol === "https:" ? "https://" : "http://");
  }, []);
  
  const apiUrl = `${protocol}jdregistration.sci.gatech.edu/sections.php`;

  // comment out function below to use local hosting
  useEffect(() => {
    async function fetchSession() {
      const res = await fetch('/api/auth/session.php');  // Adjust path if needed
      if (res.ok) {
        const session = await res.json();
        console.log('Session:', session);
        setUser(session);  // Save session data to state
      } else {
        console.log('Not logged in');
        window.location.href = '/cas-admin.php';  // Redirect to CAS login
      }
    }

    fetchSession();
  }, []);

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

  const addStudent = () => {
    if (!newStudent.name.trim()) return;

    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    })
    .then(response => response.json())
    .then(() => {
      setSections([...users, { id: Date.now(), ...newStudent }]);
      setNewSection({ name: '', gtid: '', gtusername: '', team:'' });
      setIsAddStudentPopupOpen(false);
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

<<<<<<< Updated upstream
=======
  const startLogout = () => {
    window.location.href = '/logout.php';
  };

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
      setHamburgerOptionsOpen(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleSaveAdminInfo = async () => {
    if (!newName.trim() || !gtid.trim() || !username.trim()) {
      return; // prevent empty fields
    }
  
    try {
      const postData = {
        name: newName,
        gtid,
        username
      };
  
      const response = await fetch("https://jdregistration.sci.gatech.edu/admin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
  
      const textResponse = await response.text();
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${textResponse}`);
      }
  
      setName(newName); // update locally
      setNameEditOpen(false); // close popup
      alert("Admin info updated successfully!");
    } catch (error) {
      console.error("Error updating admin info:", error);
      alert("Failed to update admin info.");
    }
  };
  
  

>>>>>>> Stashed changes
  // CSV Upload Handling
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    fetch("/admin/upload.php", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("CSV uploaded and processed successfully!");
          // Refresh data if necessary
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch(error => console.error("Upload failed", error));
  };
  

  return (
    <div className='min-h-screen bg-[#E5E2D3] font-figtree'>
      <div className='bg-[#A5925A] grid grid-cols-3 w-screen items-center'>
        <div className='p-4 text-lg lg:text-2xl font-bold w-max text-[#003056]'>Junior Design Team Sync</div>
        <div></div>
        <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
          
          <div>Admin</div>
          <DropdownTwo/>

<<<<<<< Updated upstream
        </div>
=======
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
        
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
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


      

>>>>>>> Stashed changes
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
  );
}
