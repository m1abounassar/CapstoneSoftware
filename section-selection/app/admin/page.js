'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';


export default function Home() {
  const [teams, setTeams] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [isAddSectionPopupOpen, setIsAddSectionPopupOpen] = useState(false);
  const [isEditSectionPopupOpen, setIsEditSectionPopupOpen] = useState(false);
  const [addAdminPopup, setAddAdminPopup] = useState(false);
  const [isRefreshSemesterPopupOpen, setIsRefreshSemesterPopupOpen] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', time: '', capacity: '' });
  const [newStudent, setNewStudent] = useState({ name: '', gtid: '', username: '', team:'' });
  const [rotatedTeams, setRotatedTeams] = useState(new Set());
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', gtid: '' });
  const [addStudentPopup, setAddStudentPopup] = useState(false);
  
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
  const [isLeadAdmin, setIsLeadAdmin] = useState(false);


  const [protocol, setProtocol] = useState("http://");

  useEffect(() => {
    setProtocol(window.location.protocol === "https:" ? "https://" : "http://");
  }, []);
  
  const apiUrl = `${protocol}jdregistration.sci.gatech.edu/sections.php`;

  // comment out function below to use local hosting
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
              username = sessionData.username;
              setUsername(username);
              console.log(sessionData.username);

            
              const adminRes = await fetch('https://jdregistration.sci.gatech.edu/admin.php');
              if (!adminRes.ok) throw new Error("Admin fetch failed");
          
              const adminData = await adminRes.json();
              if (!Array.isArray(adminData.adm)) {
                console.error("Unexpected data format:", adminData);
                return;
              }

              allAdmin = adminData.adm;
              setAllAdmin(allAdmin);
          
              // Find the admin info
              const matchedAdmin = adminData.adm.find(admin => admin.username.trim().toLowerCase() === sessionData.username.trim().toLowerCase() );
              console.log('info: ');
              console.log(matchedAdmin);
          
              if (matchedAdmin) {
                console.log(matchedAdmin.name);
                
                name = matchedAdmin.name
                setName(name);
                
                newName = matchedAdmin.name
                setNewName(newName);

                gtid = matchedAdmin.gtid
                setGTID(gtid);

                if (matchedAdmin.isLead == '1') {
                  isLeadAdmin = true;
                  setIsLeadAdmin(true);
                }

                const teamsRes = await fetch('https://jdregistration.sci.gatech.edu/actualTeams.php');
                if (!teamsRes.ok) throw new Error("Team fetch failed");
                    
                const teamData = await teamsRes.json();
                if (!Array.isArray(teamData.teams)) {
                    console.error("Unexpected data format:", teamData);
                    return;
                }

                allTeams = teamData.teams;
                setAllTeams(teamData.teams);
                console.log(allTeams);

                
              } else {
                console.error("Student not found in the list.");
                window.location.href = '/notFound';
              }
            
          } else {
            window.location.href = '/cas-admin.php';
          }
    
      
      }
    
      fetchData();
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

    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setSelectedSection(prev => ({ ...prev, [name]: value }));
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
      setIsEditSectionPopupOpen(false);
    })
    .catch(error => console.error('Error updating sections:', error));

  };


  const addOrUpdateSection = () => {
    if (!newSection.title.trim()) return;

    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedSection)
    })
    .then(response => response.json())
    .then(() => {
      setSections([...sections, { id: Date.now(), ...newSection }]);
      setIsAddSectionPopupOpen(false);
      setIsEditSectionPopupOpen(false);
    })
    .catch(error => console.error('Error updating sections:', error));

  };

const addStudent = (student) => {
  fetch("https://jdregistration.sci.gatech.edu/students.php", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  .then(response => response.text())  // Read response as text
  .then(responseText => {
    console.log('Raw response text:', responseText); // Log raw response
    try {
      console.log(responseText);
      const data = JSON.parse(responseText); // Parse the response manually
      if (data.error) {
        console.error('Error adding student 1:', data.error);
        return;
      }

      console.log('Success:', data.message);

      fetch("https://jdregistration.sci.gatech.edu/actualTeams.php")
        .then(response => response.json())
        .then(data => {
          const allTeamInfo = data.teams;

          const teamToUpdate = allTeamInfo.find(team => team.name === student.team);

          if (teamToUpdate) {
            const members = JSON.parse(teamToUpdate.members);

            // Add the new student's GTID to the members array
            members.push(student.gtid);

            console.log("Members: ", members);

            // Update the team in actualTeams.php with the new members array
            fetch("https://jdregistration.sci.gatech.edu/actualTeams.php", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                team: student.team,
                members: JSON.stringify(members) 
              })
            })
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
              console.log(data);

              if (data.error) {
                console.error('Error updating team:', data.error);
              } else {
                console.log('Success updating team:', data.message);
              }
            })
            .catch(error => {
              console.error('Error updating team:', error);  // Handle errors for updating the team
            });
          }
        })
        .catch(error => {
          console.error('Error fetching teams:', error);  // Handle errors for fetching teams
        });

    } catch (error) {
      console.error('Error parsing response:', error);  // Handle errors when parsing the response
    }
  })
  .catch(error => {
    console.error('Error adding student:', error);  // Handle errors for adding student
  });
};




const addAdmin = (admin) => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
};

const removeAdmin = (gtid) => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gtid }) // Wrap gtid in an object
  })
  .then(response => response.json()) // Assuming the server responds with JSON
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const newLead = (theirGTID, yourGTID) => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theirGTID, yourGTID }) // Wrap gtid in an object
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
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

  useEffect(() => {
    console.log("Value of hamburgerOptionsOpen: ", hamburgerOptionsOpen);
  }, [hamburgerOptionsOpen]);

  useEffect(() => {
    console.log("Value of settingsOpen: ", settingsOpen);
  }, [settingsOpen]);

  useEffect(() => {
    console.log("Value of logoutOpen: ", logoutOpen);
  }, [logoutOpen]);

  useEffect(() => {
    console.log("Admin List: ", allAdmin);
  }, [allAdmin]);


  return (
    <div className='min-h-screen bg-[#E5E2D3] font-figtree'>



        {/* Start Nav Bar */}
        <div className='bg-[#A5925A] grid grid-cols-3 w-screen items-center px-10'>
          <div className='flex'>
                <div className='p-4 text-lg lg:text-2xl font-bold w-max text-[#003056]'>Junior Design</div>
                <div className='p-4 text-lg lg:text-2xl w-max text-[#003056]'>Team Sync</div>
          </div>
          <div></div>
          <div className='pt-5 pb-5 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
            
            <div>{name}</div>
            <Button
                  onClick={() => setHamburgerOptionsOpen(!hamburgerOptionsOpen)}
                  className="flex bg-transparent hover:bg-transparent shadow-none hover:text[#054171] items-center justify-center text-2xl text-[#003056] hover:text-[#054171] font-bold px-3 pb-2 transition-all focus:outline-none">
            ☰</Button>
        
          </div>
        </div>
        {/* End Nav Bar */}

      

        {/* Start Body */}
        <div className='h-svh overflow-hidden bg-[#E5E2D3] font-figtree hover:cursor-default flex flex-col grid grid-rows-[fit_fit]'>

            {/* Start Header */}
            <div className="grid grid-cols-2 mt-5 mx-10 w-9/10 h-fit">


                {/* Start White Bar */}
                <div className='flex justify-center rounded-xl bg-[#FFFFFF]'>

                  <div className='py-3 font-bold'>ADMIN MODE | 104/250 </div>

                  <div className='py-3 pl-2'> Registered Students have been assigned a section</div>

                </div>

                {/* End White Bar */}


                <div className='flex justify-around rounded-lg self-center text-white text-md rounded-lg'>

                  <Button 
                    className="bg-[#A5925A] hover:bg-[#C1AC6F]"
                    onClick={() => setAddStudentPopup(true)}
                  >
                    Add Student
                  </Button>

                  <Button 
                    className="bg-[#A5925A] hover:bg-[#C1AC6F]"
                    onClick={() => setIsEditStudentPopupOpen(true)}
                  >
                    Edit Student
                  </Button>

                  <Button 
                    className="bg-[#A5925A] hover:bg-[#C1AC6F] w-2xl"
                    onClick={() => setIsRefreshSemesterPopupOpen(true)}
                  >
                    Refresh Semester
                  </Button>
                </div>


            </div>
            {/* End Header */}



            {/* Start Panels */}
            <div className="grid grid-cols-2 m-10 mt-5 gap-10">
              

                {/* Start Left Side */}
                <div className='grid grid-rows-6'>

                      {/* Start Sections Panel */}
                      <div className='bg-[#003056] w-xs h-[80%] row-span-5 rounded-3xl grid-rows-2'>
                
                          <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
                          <div className='bg-[#FFFFFF] overflow-auto h-full w-50 rounded-b-3xl px-5 py-3'>
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
                                      <Button 
                                         onClick={() => {
                                          setIsEditSectionPopupOpen(true);
                                          setSelectedSection({ title: section.title, time: section.time, capacity: section.capacity });
                                        }}
                                        className='bg-[url("/pencil.png")] hover:bg-[url("/pencilHover.png")] bg-transparent hover:bg-transparent shadow-none bg-contain bg-no-repeat h-8 w-9'></Button>
                                    </div>

                    


                                  </div>
                                ))
                              ) : (
                                <p>Loading sections...</p>
                              )}
                            </div>

                      </div>
                      {/* End Sections Panel */}
                          
                          
                      <Button 
                            className="bg-[#A5925A] hover:bg-[#C1AC6F] row-span-1 w-max text-white text-md rounded-lg hover:bg-[#80724b]"
                            onClick={() => setIsAddSectionPopupOpen(true)}
                      >Add Section
                      </Button>

                </div>
                {/* End Left Side */}


                {/* Start Right Side / Teams Panel */}
                <div className='bg-[#003056] w-xs h-2/3 rounded-3xl grid-rows-2'>

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
                      {Object.keys(allTeams).length > 0 ? (
                        Object.entries(allTeams).map(([key, value]) => (
                          <div key={value.name} className='bg-[#E5E2D3] text-[#003056] text-xl rounded-md my-2 flex items-center shadow-sm grid grid-cols-16'>
                            <div className='font-bold pt-3.5 col-start-2 col-end-12'>Team - {value.name}</div>
                            <div 
                              className='rounded-md rounded-l-lg col-start-12 text-center pt-2 text-4xl'
                              style={{
                                color: getStatusColor(value.status)
                              }}
                              >●</div>
                          </div>
                        ))
                      ) : (
                        <p>Loading teams...</p>
                      )}
                    </div>
                </div>
                {/* End Right Side / Teams Panel */}









            </div>
            {/* End Panels */}

        </div>
        {/* End Body */}


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
                onClick={() => {
                  setIsAddSectionPopupOpen(false);
                  addOrUpdateSection(newSection);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}


      {isEditSectionPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">Edit Section</h2>
            <input 
              name="title" 
              placeholder="Section Title" 
              value={selectedSection.title}
              onChange={handleEditInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="time"
              placeholder="Times"
              value={selectedSection.time}
              onChange={handleEditInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="capacity"
              placeholder="Capacity"
              value={selectedSection.capacity}
              onChange={handleEditInputChange}
              className="border p-2 rounded-md w-full mt-3"
            />
            <div className="flex justify-end mt-5">
              <Button 
                className="bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 shadow-none mr-2"
                onClick={() => setIsEditSectionPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#D01717] hover:bg-[#EA2020] text-white text-sm rounded-lg hover:bg-gray-600 shadow-none mr-2"
                onClick={() => {
                  setIsEditSectionPopupOpen(false);
                  removeSection(selectedSection);
                }}
              >
                Remove
              </Button>
              <Button 
                className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-none"
                onClick={() => {
                  setIsEditSectionPopupOpen(false);
                  addOrUpdateSection(newSection);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 
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
      )} */}


      {hamburgerOptionsOpen && (
            <div className="absolute top-0 right-0 mt-20 mr-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
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

                  <Button
                    onClick={() => setSettingsOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                  >
                    Go Back
                  </Button>
                  <Button
                    onClick={() => {
                      setSettingsOpen(false);
                      startLogout();
                    }}
                    className="mt-4 px-4 py-2 bg-[#D01717] hover:bg-[#EA2020] text-white rounded-md"
                  >
                    Logout
                  </Button>
              </div>



            </div>
            
        </div>
      )}


      {addStudentPopup && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-max text-center">
            <h2 className="text-xl font-bold mb-4">Add Student</h2>

              <div className='flex flex-col gap-5'>

                    <div className='flex'>

                            <div>Name: </div>
              
                            <input
                              type="text"
                              value={newStudent.name}
                              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                              placeholder="George Burdell"
                              className="border border-gray-300 p-2 rounded-md w-2/3"
                            />
              
                    </div>

                    <div className='flex'>

                            <div className='text-nowrap'>GT Username: </div>
              
                            <input
                              type="text"
                              value={newStudent.username}
                              onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                              placeholder="gburdell3"
                              className="border border-gray-300 p-2 rounded-md w-2/3"
                            />
              
                    </div>

                    <div className='flex'>

                            <div>GTID: </div>
              
                            <input
                              type="text"
                              value={newStudent.gtid}
                              onChange={(e) => setNewStudent({ ...newStudent, gtid: e.target.value })}
                              placeholder="903XXXXXX"
                              className="border border-gray-300 p-2 rounded-md w-2/3"
                            />

                                  
              
                    </div>

                    <div className='flex flex-col'>

                            <div className='flex flex-row'>
                                
                                <div>Team: </div>
                  
                                <input
                                  type="text"
                                  value={newStudent.team}
                                  onChange={(e) => setNewStudent({ ...newStudent, team: e.target.value })}
                                  placeholder="1234"
                                  className="border border-gray-300 p-2 rounded-md w-2/3"
                                />       
                                
                            </div>

                            <div className='text-sm'>Put 0000 for solo students </div>

                    </div>
                                  
                    <div>
                        <Button
                          onClick={() => {
                            setAddStudentPopup(false);
                          }}
                          className="mt-4 px-4 py-2 bg-[#D01717] hover:bg-[#EA2020] text-white font-bold rounded-md"> Cancel
                        </Button>
    
                        <Button
                          onClick={() => {
                            addStudent(newStudent);
                            setAddStudentPopup(false);
                          }}
                          className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] text-[#003056] rounded-md"> Add
                        </Button>
                    </div>
      
              </div>



            </div>
            
        </div>
      )}


    {addAdminPopup && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-max text-center">
            <h2 className="text-xl font-bold mb-4">Add Admin</h2>

              <div className='flex flex-col gap-5'>

                    <div className='flex'>

                            <div>Name: </div>
              
                            <input
                              type="text"
                              value={newAdmin.name}
                              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                              placeholder="George Burdell"
                              className="border border-gray-300 p-2 rounded-md w-2/3"
                            />
              
                    </div>

                    <div className='flex'>

                            <div>GT Username: </div>
              
                            <input
                              type="text"
                              value={newAdmin.username}
                              onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                              placeholder="gburdell3"
                              className="border border-gray-300 p-2 rounded-md w-2/3"
                            />
              
                    </div>

                    <div className='flex'>

                            <div>GTID: </div>
              
                            <input
                              type="text"
                              value={newAdmin.gtid}
                              onChange={(e) => setNewAdmin({ ...newAdmin, gtid: e.target.value })}
                              placeholder="903XXXXXX"
                              className="border border-gray-300 p-2 rounded-md w-2/3"
                            />

                                  
              
                    </div>
                                  
                    <div>
                        <Button
                          onClick={() => {
                            setAddAdminPopup(false);
                          }}
                          className="mt-4 px-4 py-2 bg-[#D01717] hover:bg-[#EA2020] text-white font-bold rounded-md"> Cancel
                        </Button>
    
                        <Button
                          onClick={() => {
                            addAdmin(newAdmin);
                            setAddAdminPopup(false);
                          }}
                          className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] text-[#003056] rounded-md"> Add
                        </Button>
                    </div>
      
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

                  <Button
                    onClick={() => setSettingsOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleSaveName();
                      setSettingsOpen(false);
                    }}
                    className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                  >
                    Save
                  </Button>
              </div>

            </div>


            </div>
            
        </div>
      )}

      {(settingsOpen && (isLeadAdmin == true)) && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white grid grid-cols-2 gap-4 p-6 rounded-md shadow-lg w-3/4 h-max text-center">

                <div className=''>

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

                          <Button
                            onClick={() => setSettingsOpen(false)}
                            className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                          >
                            Close
                          </Button>
                          <Button
                            onClick={() => {
                              handleSaveName();
                              setSettingsOpen(false);
                            }}
                            className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                          >
                            Save
                          </Button>
                      </div>

                    </div>
                </div>

                <div className=''>

                    <h2 className="text-xl font-bold mb-4">Admin Settings</h2>

                    <div className='overflow-auto'>

                    {Object.keys(allAdmin).length > 0 ? (
                      Object.entries(allAdmin).map(([key, values]) => (
                        <div key={values.name} className='text-[#003056] text-lg mx-5 my-2 grid grid-cols-3 items-center'>

                          <div className='col-span-1 text-nowrap'>{values.name}</div>
                          <div className='col-span-1 col-start-3 text-nowrap flex'>

                              <Button className='bg-[url("/crown.png")] hover:bg-[url("/crownHover.png")] bg-transparent hover:bg-transparent shadow-none bg-contain bg-no-repeat h-8 w-9'
                                  onClick={() => {
                                    newLead(values.gtid, gtid);
                              }}></Button>
                              <Button className='bg-[url("/remove.png")] hover:bg-[url("/removeHover.png")] bg-transparent hover:bg-transparent ml-3 shadow-none bg-contain bg-no-repeat h-8 w-9'
                                  onClick={() => {
                                    removeAdmin(values.gtid);
                              }}></Button>        
          
                          </div>
                          

                        </div>
                      ))
                    ) : (
                      <p>Loading Admin...</p>
                    )}


                    </div>

                    
                    <div className='flex gap-5 justify-center font-bold'>

                          <Button
                            onClick={() => {
                              setAddAdminPopup(true);
                              setSettingsOpen(false);
                            }}
                            className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                          >
                            Add an Admin
                          </Button>
                     </div>

                    </div>

                </div>


            </div>
            
      )}

        
       {/*  <div className="m-10">
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
        </div> */}

    </div>



  
  );
}



        

          





          
            
            
