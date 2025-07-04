'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';


export default function Home() {
  const [teams, setTeams] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState({ id: '', title: '', time: '', capacity: '' });
  const [selectedStudent, setSelectedStudent] = useState({ name: '', username: '', gtid: '', team: ''});
  const [isAddSectionPopupOpen, setIsAddSectionPopupOpen] = useState(false);
  const [isEditSectionPopupOpen, setIsEditSectionPopupOpen] = useState(false);

  const [isAddStudentPopupOpen, setIsAddStudentPopupOpen] = useState(false);
  const [isEditStudentPopupOpen, setIsEditStudentPopupOpen] = useState(false);
  const [seeAllstudents, setSeeAllStudents] = useState(false);


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

  function parsePref(prefString) {
    try {
      const parsed = JSON.parse(prefString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const handleRefreshSemester = () => {
    if (!window.confirm("Are you sure you want to refresh the semester? This will delete all students, teams, and sections.")) return;
  
    fetch("/admin/refresh_semester.php", {
      method: "POST"
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Semester refreshed successfully!");
        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    })
    .catch(error => {
      console.error("Refresh failed", error);
      alert("Unexpected error occurred.");
    });
  };


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

                //allTeams = teamData.teams;
                setTeams(teamData.teams);
                setAllTeams(teamData.teams);
                console.log(allTeams);

                const studentsRes = await fetch('https://jdregistration.sci.gatech.edu/students.php');
                if (!studentsRes.ok) throw new Error("Students fetch failed");

                const studentsData = await studentsRes.json();
                if (!Array.isArray(studentsData.students)) {
                  console.error("Unexpected student data format:", studentsData);
                  return;
                }

                setAllStudents(studentsData.students);


                
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
      .then(response => response.text())  // Get the raw response text
      .then(responseText => {
        console.log("Raw response text:", responseText);  // This will print the raw response
        const data = JSON.parse(responseText);  // Parse the response text into JSON
        setSections(data.sections);
      })
      .catch(error => console.error("Error loading sections:", error));
  }, []);

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  /* const addOrUpdateSection = (sec) => {
    if (!sec.title.trim()) return;

    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec)
    })
    .then(response => response.json())
    .then(() => {
      setSections([...sections, { id: Date.now(), ...newSection }]);
      setNewSection({ title: '', time: '', capacity: '' });
      setIsAddSectionPopupOpen(false);
      setIsEditSectionPopupOpen(false);
    })
    .catch(error => console.error('Error updating sections:', error));

  }; */
  /* const addOrUpdateSection = (sec) => { this works so dont delete
    if (!sec.title.trim()) return;
  
    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec)
    })
      .then(response => response.json())
      .then(() => {
        setSections(prevSections => {
          const index = prevSections.findIndex(s => s.title === sec.title);
          if (index !== -1) {
            // Update existing section
            const newList = [...prevSections];
            newList[index] = sec;
            return newList;
          } else {
            // Add new section
            return [...prevSections, { id: Date.now(), ...sec }];
          }
        });
  
        setNewSection({ title: '', time: '', capacity: '' });
        setIsAddSectionPopupOpen(false);
        setIsEditSectionPopupOpen(false);
      })
      .catch(error => console.error('Error updating sections:', error));
  }; */
  const addSection = (sec) => {
    if (!sec.title.trim()) return;
  
    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec)
    })
    .then(response => response.json())
    .then(() => {
      // Refresh or update section list
      setSections(prev => [...prev, { ...sec }]);
      setNewSection({ title: '', time: '', capacity: '' });
      setIsAddSectionPopupOpen(false);
    })
    .catch(error => console.error('Error adding section:', error));
  };
  
  const updateSection = (sec) => {
    if (!sec.title.trim() || !sec.id) return;
  
    fetch("https://jdregistration.sci.gatech.edu/sections.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec)
    })
    .then(response => response.json())
    .then(() => {
      setSections(prevSections => prevSections.map(s => s.id === sec.id ? sec : s));
      setSelectedSection({ title: '', time: '', capacity: '' });
      setIsEditSectionPopupOpen(false);
    })
    .catch(error => console.error('Error updating section:', error));
  };
  


  const removeSection = () => {
    if (!selectedSection.title.trim()) return;

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




const addAdmin = () => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAdmin)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .then(() => {
      setNewAdmin({ name: '', username: '', gtid: '' });
    })
  .catch(error => console.error('Error:', error));
};

/* const removeAdmin = (gtid) => {
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
}; */

const removeAdmin = (gtid) => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gtid })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    window.location.reload(); // ✅ Refresh after success
  })
  .catch(error => console.error('Error:', error));
};

/* const newLead = (theirGTID, yourGTID) => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theirGTID, yourGTID }) // Wrap gtid in an object
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
}; */
const newLead = (theirGTID, yourGTID) => {
  fetch("https://jdregistration.sci.gatech.edu/admin.php", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theirGTID, yourGTID })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    window.location.reload(); // ✅ Refresh after success
  })
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
  const handleExportCSV = () => {
    const rows = [["GTID", "Username", "Ideal Section"]];
  
    teams.forEach(team => {
      const teamMembers = allStudents.filter(s => JSON.parse(team.members).includes(s.gtID));
  
      const sectionScores = {};
      sections.forEach(section => {
        sectionScores[section.title] = [];
      });
  
      const everyoneFilled = teamMembers.every(member => {
        const first = parsePref(member.firstChoice);
        const second = parsePref(member.secondChoice);
        return first.length > 0 || second.length > 0;
      });
  
      let idealSection = "N/A";
      if (everyoneFilled) {
        teamMembers.forEach(member => {
          const first = parsePref(member.firstChoice);
          const second = parsePref(member.secondChoice);
          sections.forEach(section => {
            const title = section.title;
            if (first.includes(title)) sectionScores[title].push(1);
            else if (second.includes(title)) sectionScores[title].push(2);
            else sectionScores[title].push(3);
          });
        });
  
        let bestScore = Infinity;
        let bestOnes = 0;
        for (const title in sectionScores) {
          const scores = sectionScores[title];
          const total = scores.reduce((a, b) => a + b, 0);
          const ones = scores.filter(x => x === 1).length;
  
          if (
            total < bestScore ||
            (total === bestScore && ones > bestOnes) ||
            (total === bestScore && ones === bestOnes && title < idealSection)
          ) {
            idealSection = title;
            bestScore = total;
            bestOnes = ones;
          }
        }
      }
  
      teamMembers.forEach(member => {
        rows.push([member.gtID, member.username, idealSection]);
      });
    });
  
    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ideal_sections.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          window.location.reload(); 
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

  useEffect(() => {
    console.log("Selected Section: ", selectedSection);
  }, [selectedSection]);


  return (
    <div className='min-h-screen bg-[#E5E2D3] font-figtree'>

      {/* Start Nav Bar */}
      <div className='bg-[#A5925A] grid grid-cols-3 w-681 items-center px-10 py-2'>

          {/* Left-aligned logo and title */}
          <div className='text-lg lg:text-4xl w-max text-[#232323] font-bold flex items-center'>
              {/* Website Logo */}
              <img src="/logo.png" alt="Website Logo" className="w-12 h-12" /> {/* Adjust size as needed */}
              <div className= 'text-md'>
                  Team Sync <span className='pt-0 pb-4 pl-0 text-lg font-normal text-[#003056]'> for Junior Design</span>
              </div>
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
      <div className='h-svh overflow-hidden bg-[#E5E2D3] font-figtree hover:cursor-default grid grid-flow-row auto-rows-max gap-5'>

          {/* Start Header */}
          <div className="grid grid-cols-2 mt-5 mx-10 w-9/10 h-min">


              {/* Start White Bar */}
              <div className='flex justify-center rounded-xl bg-[#FFFFFF]'>

                  <div className='py-3 font-bold'>ADMIN MODE | 104/250 </div>

                  <div className='py-3 pl-2'> Registered Students have been assigned a section</div>

              </div>
              {/* End White Bar */}


                <div className='flex justify-around rounded-lg self-center text-white text-md rounded-lg'>

                    <Button 
                      className="bg-[#A5925A] hover:bg-[#80724b]"
                      onClick={() => setIsAddStudentPopupOpen(true)}
                    >
                      Add Student
                    </Button>

                    <Button 
                      className="bg-[#A5925A] hover:bg-[#C1AC6F]"
                      onClick={() => setSeeAllStudents(true)}
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
         <div className="grid grid-cols-2 content-start mx-10 gap-10">
          
              {/* Start Left */}
              <div className=''>
            
            
                {/* Start Sections Panel */}
                <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2'>
                    <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
                    <div className='bg-[#FFFFFF] h-full w-50 rounded-b-3xl px-5 py-3 border-5 border-[#003056]'>
                        {sections.length > 0 ? (
                            sections.map((section) => (
                                <div key={section.id} className='px-5 py-3 bg-[#E5E2D3] grid grid-cols-2 rounded-md my-2 shadow-sm text-lg items-center'>
                                    <div className='flex flex-col'>

                                        <div className='flex gap-2 items-center text-[#003056]'>  {/* row 1 */}
                                            <div className='font-bold w-auto'>{section.title}</div>
                                            <div className='mr-10'>- {section.time}</div>
                                        </div>

                                        <div className='flex'>
                                            <div className='text-black opacity-40'>{section.capacity} seats remaining</div>
                                        </div>
                                    </div>

                                    <div className='flex justify-self-end'>
                                        <button className='bg-[url("/pencil.png")] hover:bg-[url("/pencilHover.png")] bg-contain bg-no-repeat h-8 w-9' 
                                            onClick={() => {
                                              setSelectedSection({id: section.id, title: section.title, time: section.time, capacity: section.capacity});
                                              setIsEditSectionPopupOpen(true);
                                            }}
                                        ></button>
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
                  className="bg-[#A5925A] mt-5 text-white text-sm rounded-lg hover:bg-[#80724b] shadow-sm"
                  onClick={() => setIsAddSectionPopupOpen(true)}
                >
                  Add Section
                </Button>

          </div>
          {/* End Left */}



          {/* Teams Panel */}
          <div className='bg-[#003056] w-xs h-min rounded-3xl grid-rows-2'>
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
                teams.map((team) => {
                  const teamMembers = allStudents.filter(s => JSON.parse(team.members).includes(s.gtID));

                  //const sectionScores = {};
                  //let everyoneFilled = true;

                  // Initialize scores per section
                  /* sections.forEach(section => {
                    sectionScores[section.title] = [];
                  }); */

                  /* teamMembers.forEach(member => {
                    const first = JSON.parse(member.firstChoice);
                    const second = JSON.parse(member.secondChoice);
                    const third = JSON.parse(member.thirdChoice);

                    if (first.length === 0 && second.length === 0) {
                      everyoneFilled = false;
                    }

                    sections.forEach(section => {
                      const title = section.title;
                      if (first.includes(title)) sectionScores[title].push(1);
                      else if (second.includes(title)) sectionScores[title].push(2);
                      else sectionScores[title].push(3);
                    });
                  }); */
                  const sectionScores = {};
                  sections.forEach(section => {
                    sectionScores[section.title] = [];
                  });

                  /* const everyoneFilled = teamMembers.every(member => {
                    const first = JSON.parse(member.firstChoice);
                    const second = JSON.parse(member.secondChoice);
                    return first.length > 0 || second.length > 0;
                  }); */
                  const everyoneFilled = teamMembers.every(member => {
                    const first = parsePref(member.firstChoice);
                    const second = parsePref(member.secondChoice);
                    return first.length > 0 || second.length > 0;
                  });                  

                  teamMembers.forEach(member => {
                    //const first = JSON.parse(member.firstChoice);
                    //const second = JSON.parse(member.secondChoice);
                    //const third = JSON.parse(member.thirdChoice);
                    const first = parsePref(member.firstChoice);
                    const second = parsePref(member.secondChoice);
                    const third = parsePref(member.thirdChoice);


                    sections.forEach(section => {
                      const title = section.title;
                      if (first.includes(title)) sectionScores[title].push(1);
                      else if (second.includes(title)) sectionScores[title].push(2);
                      else sectionScores[title].push(3);
                    });
                  });

                  // Compute ideal section
                 let idealSection = null;
                  if (everyoneFilled) {
                    let bestScore = Infinity;
                    let bestOnes = 0;

                    for (const title in sectionScores) {
                      const scores = sectionScores[title];
                      const total = scores.reduce((a, b) => a + b, 0);
                      const ones = scores.filter(x => x === 1).length;

                      if (
                        total < bestScore ||
                        (total === bestScore && ones > bestOnes) ||
                        (total === bestScore && ones === bestOnes && title < idealSection)
                      ) {
                        idealSection = title;
                        bestScore = total;
                        bestOnes = ones;
                      }
                    }
                  }

                  return (
                    <div key={team.name} className='bg-[#E5E2D3] text-[#003056] text-xl rounded-md my-2 shadow-sm'>
                      <div className='grid grid-cols-16 items-center'>
                        <div
                          className='p-3 pr-0 text-[#A5925A] hover:text-[#877645] cursor-pointer text-2xl col-start-1 col-end-2'
                          style={{
                            transform: rotatedTeams.has(team.name) ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                          onClick={() => toggleRotation(team.name)}>
                          ▶
                        </div>
                        <div className='font-bold pt-3.5 col-start-2 col-end-12'>Team {team.name}</div>
                        <div
                          className='col-start-12 text-center pt-2 text-4xl'
                          style={{ color: everyoneFilled ? '#66D575' : '#FF7556' }}>
                          ●
                        </div>
                      </div>
                      {/* DEBUG: remove later */}
                      {/* <p className="text-sm italic pl-6 text-[#888]">
                        Debug: everyoneFilled = {String(everyoneFilled)}
                      </p> */}
                      {!everyoneFilled && (
                        <div className="text-sm italic pl-6 text-[#D01717]">
                         <p className="font-bold">Missing Preferences:</p>
                          {teamMembers.map((member) => {
                            const first = parsePref(member.firstChoice);
                            const second = parsePref(member.secondChoice);
                            if (first.length === 0 && second.length === 0) {
                              return (
                                <p key={member.gtID}>
                                  ❌ {member.name} ({member.username})
                                </p>
                              );
                           }
                            return null;
                          })}
                        </div>
                      )}


                      {rotatedTeams.has(team.name) && (
                        <div className='px-6 py-3 text-lg border-t border-[#A5925A]'>
                          <div className='flex justify-between text-xl font-bold text-[#003056] pb-2'>
                            <div>Project: {team.projectName}</div>
                            <div>Client: {team.clientName}</div>
                          </div>

                          <div className='text-[#003056] text-md'>
                            {/* <div className='font-bold pt-2'>Team Section Preferences:</div> */}
                            {/* {teamMembers.map(member => {
                              const first = JSON.parse(member.firstChoice);
                              const second = JSON.parse(member.secondChoice);
                              const third = JSON.parse(member.thirdChoice);
                              return (
                                <div key={member.gtID} className='mt-2'>
                                  <span className='font-medium'>{member.name}:</span>{' '}
                                  {first.map((s, i) => <span key={i} className='font-bold ml-1'>{s}</span>)}
                                  {second.length > 0 && (
                                    <>
                                      <span className='ml-2'>|</span>
                                      {second.map((s, i) => <span key={i} className='ml-1'>{s}</span>)}
                                    </>
                                  )}
                                </div>
                              );
                            })} */}

                            <div className='font-bold pt-4'>Ideal Section for This Group:</div>
                            {everyoneFilled ? (
                              <p>
                                The ideal section is{' '}
                                <span className='font-bold text-[#A5925A]'>{idealSection}</span>
                              </p>
                            ) : (
                              <p>Not everyone in the group has filled out their preferences!</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>Loading teams...</p>
              ) }
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end pr-5 gap-3">
          <Button 
            className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-sm"
            onClick={handleExportCSV}
          >
            Export Ideal Sections CSV
          </Button>

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
      


      {/* Pop-up Modal for Adding Section */}
      {isAddSectionPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">Add a New Section</h2>
            <input 
              name="title" 
              placeholder="Section Title" 
              value={newSection.title}
              onChange={(e) => handleInputChange(e, setNewSection)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="time"
              placeholder="Times"
              value={newSection.time}
              onChange={(e) => handleInputChange(e, setNewSection)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="capacity"
              placeholder="Capacity"
              value={newSection.capacity}
              onChange={(e) => handleInputChange(e, setNewSection)}
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
                  addSection(newSection);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}


       {/* Pop-up Modal for Editing Seciton */}
      {isEditSectionPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">Edit Section</h2>
            <input 
              name="title" 
              placeholder="AAA" 
              value={selectedSection.title}
              onChange={(e) => handleInputChange(e, setSelectedSection)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="time"
              placeholder="1:00 PM - 2:00 PM"
              value={selectedSection.time}
              onChange={(e) => handleInputChange(e, setSelectedSection)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="capacity"
              placeholder="20"
              value={selectedSection.capacity}
              onChange={(e) => handleInputChange(e, setSelectedSection)}
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
                className="bg-[#D01717] text-white text-sm rounded-lg hover:bg-[#EA2020] shadow-none mr-2"
                onClick={() => {
                  setIsEditSectionPopupOpen(false);
                  removeSection();
                }}>
                Remove
              </Button>
                  
              <Button 
                className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-none"

                onClick={() => {
                  setIsEditSectionPopupOpen(false);
                  updateSection(selectedSection);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Modal for Adding Admin */}
      {addAdminPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">Add a New Admin</h2>
            <input 
              name="name" 
              placeholder="George Burdell" 
              value={newAdmin.name}
              onChange={(e) => handleInputChange(e, setNewAdmin)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="gtid"
              placeholder="903XXXXXX"
              value={newAdmin.gtid}
              onChange={(e) => handleInputChange(e, setNewAdmin)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="username"
              placeholder="gburdell3"
              value={newAdmin.username}
              onChange={(e) => handleInputChange(e, setNewAdmin)}
              className="border p-2 rounded-md w-full mt-3"
            />

            <div className="flex justify-end mt-5">
              <Button 
                className="bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 shadow-none mr-2"
                onClick={() => {
                  setAddAdminPopup(false);
                  setSettingsOpen(true);
                }}>
                Cancel
              </Button>
              <Button 
                className="bg-[#A5925A] text-white text-sm rounded-lg hover:bg-[#80724b] shadow-none"
                onClick={() => {
                  addAdmin();
                  setAddAdminPopup(false);
                  setSettingsOpen(true);
                }}
              >
                Add
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
              value={newStudent.name}
              onChange={(e) => handleInputChange(e, setNewStudent)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="gtid"
              placeholder="903XXXXXX"
              value={newStudent.gtid}
              onChange={(e) => handleInputChange(e, setNewStudent)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="gtusername"
              placeholder="gburdell3"
              value={newStudent.username}
              onChange={(e) => handleInputChange(e, setNewStudent)}
              className="border p-2 rounded-md w-full mt-3"
            />
            <input
              name="team"
              placeholder="1234"
              value={newStudent.team}
              onChange={(e) => handleInputChange(e, setNewStudent)}
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
                onClick={() => {
                  addStudent(newStudent);
                  setIsAddStudentPopupOpen(false);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Modal for Editing a Student's information */}
      {isEditStudentPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center text-[#003056] bg-black bg-opacity-50">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold">Edit Student</h2>

                  <input 
                    name="name" 
                    placeholder="George Burdell" 
                    value={selectedStudent.name}
                    onChange={(e) => handleInputChange(e, setSelectedStudent)}
                    className="border p-2 rounded-md w-full mt-3"
                  />

                  <input
                    name="username"
                    placeholder="gburdell3"
                    value={selectedStudent.username}
                    onChange={(e) => handleInputChange(e, setSelectedStudent)}
                    className="border p-2 rounded-md w-full mt-3"
                  />

                  <input
                    name="gtid"
                    placeholder="903XXXXXX"
                    value={selectedStudent.capacity}
                    onChange={(e) => handleInputChange(e, setSelectedStudent)}
                    className="border p-2 rounded-md w-full mt-3"
                  />

                  <input
                    name="team"
                    placeholder="1234"
                    value={selectedStudent.team}
                    onChange={(e) => handleInputChange(e, setSelectedStudent)}
                    className="border p-2 rounded-md w-full mt-3"
                  />
                  
                  <div className="flex justify-end mt-5">
                    <Button
                      className="bg-[#D01717] text-white text-sm rounded-lg hover:bg-[#EA2020] shadow-none"
                      onClick={() => setIsEditStudentPopupOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      className="bg-[#003056] text-white text-sm rounded-lg hover:bg-[#EA2020] shadow-none"
                      onClick={() => {setIsEditStudentPopupOpen(false)}}
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
            <h2 className="text-lg font-bold">Refresh Semester</h2>
            <p className="mt-2 text-gray-700">
              This will permanently delete all students, teams, and sections. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end mt-5">
              <Button 
                className="bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 shadow-none mr-2"
                onClick={() => setIsRefreshSemesterPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#D01717] text-white text-sm rounded-lg hover:bg-[#EA2020] shadow-none"
                onClick={() => {
                  setIsRefreshSemesterPopupOpen(false);
                  handleRefreshSemester();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      


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
                  onChange={(e) => handleInputChange(e, setNewName)}
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
                          onChange={(e) => handleInputChange(e, setNewName)}
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

    {seeAllstudents && (
        <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

            <div className="bg-white gap-4 p-6 rounded-md shadow-lg w-2xl h-max text-center">

                    <h2 className="text-xl font-bold mb-4">Students</h2>

                    <div className='overflow-auto'>

                        {Object.keys(allStudents).length > 0 ? (
                          Object.entries(allStudents).map(([key, values]) => (
                            <div key={values.name} className='text-[#003056] text-lg mx-5 my-2 grid grid-cols-2 items-center'>

                              <div className='text-nowrap justify-self-start'>{values.name}</div>

                                  <Button className='justify-self-end bg-[url("/pencil.png")] hover:bg-[url("/pencilHover.png")] bg-transparent hover:bg-transparent shadow-none bg-contain bg-no-repeat h-8 w-9'
                                      onClick={() => {
                                        setSelectedStudent({name: values.name, gtid: values.gtID, username: values.username, team: values.team});
                                        setSeeAllStudents(false);
                                        setIsEditStudentPopupOpen(true);
                                  }}></Button>     
                              

                            </div>
                          ))
                        ) : (
                          <p>Loading Students...</p>
                        )}


                    </div>

                    <Button className='justify-self-end bg-[#A5925A] hover:bg-[#C1AC6F] shadow-none bg-contain bg-no-repeat h-8 w-9'
                        onClick={() => {
                          setSeeAllStudents(false);
                    }}>Close</Button>   


            </div>


        </div>
            
      )}

        

    </div>
  );
}