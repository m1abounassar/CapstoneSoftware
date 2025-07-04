'use client'
import { useState, useEffect } from 'react';
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from '@/components/ui/button';


export default function Home() {
  const [sections, setSections] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [teams, setTeams] = useState({});
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [gtid, setGTID] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({});
  const [savePrefOpen, setSavePrefOpen] = useState(false);
  const [teamNumber, setTeamNumber] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  // New state for the name edit popup
  const [nameEditOpen, setNameEditOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [hamburgerOptionsOpen, setHamburgerOptionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [leaveTeamOpen, setLeaveTeamOpen] = useState(false);

  //fix
  const [everyoneFilled, setEveryoneFilled] = useState(undefined);
  const [idealSection, setIdealSection] = useState("");



  function parsePref(prefString) {
    try {
      const parsed = JSON.parse(prefString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }



  useEffect(() => {
    async function fetchData() {
        //const sessionRes = await fetch("https://jdregistration.sci.gatech.edu/api/auth/session.php");
        const sectionsRes = await fetch("https://jdregistration.sci.gatech.edu/sections.php");
      if (!sectionsRes.ok) {
        console.error("Failed to fetch sections");
        return;
      }

      const sectionsData = await sectionsRes.json();
      if (!Array.isArray(sectionsData.sections)) {
        console.error("Unexpected sections format", sectionsData);
        return;
      }

      setSections(sectionsData.sections);

      // Continue with session logic
      const sessionRes = await fetch("https://jdregistration.sci.gatech.edu/api/auth/session.php");
      if (!sessionRes.ok) {
          window.location.href = '/error';
      }

      const sessionData = await sessionRes.json();
        if (!sessionRes.ok) {
            window.location.href = '/error';
        }

        //const sessionData = await sessionRes.json();
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
              gtid = matchedStudent.gtID;
              setGTID(gtid);
              console.log("GTID: ", gtid);

              const initialDropdownValues = {};

              const firstChoiceArray = parsePref(matchedStudent.firstChoice);
              const secondChoiceArray = parsePref(matchedStudent.secondChoice);
              const thirdChoiceArray = parsePref(matchedStudent.thirdChoice);

              // If no preferences saved yet, default all to yellow
              if (
                (!firstChoiceArray || firstChoiceArray.length === 0) &&
                (!secondChoiceArray || secondChoiceArray.length === 0) &&
                (!thirdChoiceArray || thirdChoiceArray.length === 0)
              ) {
                const sectionsRes = await fetch('https://jdregistration.sci.gatech.edu/sections.php');
                if (!sectionsRes.ok) throw new Error("Sections fetch failed");

                const sectionsData = await sectionsRes.json();
                if (!Array.isArray(sectionsData.sections)) {
                  console.error("Unexpected data format:", sectionsData);
                  return;
                }

                sectionsData.sections.forEach((section) => {
                  initialDropdownValues[section.title] = "3";
                });
              } else {
                firstChoiceArray.forEach((section) => {
                  initialDropdownValues[section] = "1";
                });
                secondChoiceArray.forEach((section) => {
                  initialDropdownValues[section] = "2";
                });
                thirdChoiceArray.forEach((section) => {
                  initialDropdownValues[section] = "3";
                });
              }

              //const firstChoiceArray = JSON.parse(matchedStudent.firstChoice);
              //const secondChoiceArray = JSON.parse(matchedStudent.secondChoice);
              //const thirdChoiceArray = JSON.parse(matchedStudent.thirdChoice);



              /* if (!firstChoiceArray) {
                const sectionsRes = await fetch('https://jdregistration.sci.gatech.edu/sections.php');
                if (!sectionsRes.ok) throw new Error("Sections fetch failed");
    
                const sectionsData = await sectionsRes.json();
                if (!Array.isArray(sectionsData.sections)) {
                  console.error("Unexpected data format:", sectionsData);
                  return;
                }

                (sectionsData.sections).forEach((section) => {
                  initialDropdownValues[section.title] = "3";
                });
                
              } else {


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
                
              } */

              //dropdownValues = initialDropdownValues;
              //setDropdownValues(dropdownValues);
              //priorities = dropdownValues;
              //setPriorities(priorities);
              setDropdownValues(initialDropdownValues);
              setPriorities(initialDropdownValues);
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

                  clientName = teams.clientName;
                  setClientName(clientName);
                  newClientName = teams.clientName;
                  setNewClientName(newClientName);

                  projectName = teams.projectName;
                  setProjectName(projectName);
                  newProjectName = teams.projectName;
                  setNewProjectName(newProjectName);


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

        setSections(data.sections);
        //setSections(sections);
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

  
  const handleSavedSettings = async () => {
      if (!newName.trim()) {
        return; // Don't save empty names
      }

      if (newName !== name && (newName.trim())) {

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
            
          } catch (error) {
            console.error("Error updating name:", error);
          }
        
      }

      if (clientName != newClientName && (clientName.trim())) {

            try {
                const postData = {
                  number: teamNumber,
                  clientName: newClientName
                };
            
                const response = await fetch("https://jdregistration.sci.gatech.edu/actualTeams.php", {
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
                setClientName(newClientName);

          } catch (error) {
            console.error("Error updating client name:", error);
          }
        
      }

      if (projectName != newProjectName && (projectName.trim())) {

            try {
                const postData = {
                  number: teamNumber,
                  projectName: projectName
                };
            
                const response = await fetch("https://jdregistration.sci.gatech.edu/actualTeams.php", {
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
                setProjectName(newProjectName);

          } catch (error) {
            console.error("Error updating project name:", error);
          }
        
      }

    setSettingsOpen(false);

};

  useEffect(() => {
    console.log("Updated Team Members:", teamMembers);
    console.log(typeof teamMembers);
    console.log(Object.keys(teamMembers).length);
  }, [teamMembers]);

  useEffect(() => {
    console.log("Updated Dropdown Values:", dropdownValues);
  }, [dropdownValues]);

  useEffect(() => {
    if (!sections.length || Object.keys(teamMembers).length === 0) return;
  
    let allFilled = true;
    const sectionScores = {};
  
    sections.forEach(section => {
      sectionScores[section.title] = [];
    });
  
    for (const memberName in teamMembers) {
      const { firstChoice, secondChoice, thirdChoice } = teamMembers[memberName];
  
      //const first = JSON.parse(firstChoice);
      //const second = JSON.parse(secondChoice);
      //const third = JSON.parse(thirdChoice);

      const first = parsePref(firstChoice);
      const second = parsePref(secondChoice);
      const third = parsePref(thirdChoice);
  
      if (first.length === 0 && second.length === 0) {
        allFilled = false;
        break;
      }
  
      sections.forEach(section => {
        const title = section.title;
        if (first.includes(title)) {
          sectionScores[title].push(1);
        } else if (second.includes(title)) {
          sectionScores[title].push(2);
        } else {
          sectionScores[title].push(3);
        }
      });
    }
  
    setEveryoneFilled(allFilled);
  
    if (allFilled) {
      let best = null;
      let bestScore = Infinity;
      let bestOnes = 0;
  
      for (const section in sectionScores) {
        const scores = sectionScores[section];
        const total = scores.reduce((sum, val) => sum + val, 0);
        const ones = scores.filter(val => val === 1).length;
  
        if (
          total < bestScore ||
          (total === bestScore && ones > bestOnes) ||
          (total === bestScore && ones === bestOnes && section < best)
        ) {
          best = section;
          bestScore = total;
          bestOnes = ones;
        }
      }
  
      setIdealSection(best);
    }
  }, [teamMembers, sections]);
  

  const startLogout = () => {
    window.location.href = '/logout.php';
  };
  
  const startLeaveTeam = () => {
    fetch("https://jdregistration.sci.gatech.edu/actualTeams.php")
      .then(response => response.json())
      .then(data => {
        const allTeamInfo = data.teams;
        const teamToUpdate = allTeamInfo.find(team => team.name === teamNumber);
  
        if (teamToUpdate) {
          let members = JSON.parse(teamToUpdate.members);
  
          // Remove the student's GTID from the members array
          members = members.filter(gtID => gtID !== gtid);
  
          console.log("Updated Members:", members);
  
          // Update the team in actualTeams.php with the modified members array
          fetch("https://jdregistration.sci.gatech.edu/actualTeams.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              team: teamNumber,
              members: JSON.stringify(members),
            }),
          })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
              console.log(data);
  
              if (data.error) {
                console.error("Error updating team:", data.error);
              } else {
                console.log("Success updating team:", data.message);
              }
            })
            .catch(error => {
              console.error("Error updating team:", error); // Handle errors for updating the team
            });
        }
      })
      .catch(error => {
        console.error("Error fetching teams:", error); // Handle errors for fetching teams
      });

  
    fetch("https://jdregistration.sci.gatech.edu/students.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        team: '0000',
      }),
    })
      .then(response => response.text()) // Read response as text
      .then(responseText => {
        console.log("Raw response text:", responseText); // Log raw response
        try {
          console.log(responseText);
          const data = JSON.parse(responseText); // Parse the response manually
          if (data.error) {
            console.error("Error adding student 1:", data.error);
            return;
          }
  
          console.log("Success:", data.message);
          window.location.href = "/"; // Redirect after successful update
        } catch (error) {
          console.error("Error parsing response:", error);
        }
      })
      .catch(error => {
        console.error("Error updating student:", error);
      });
  }; 

  


  return (
    <div className='h-svh overflow-hidden bg-[#E5E2D3] font-figtree hover:cursor-default flex flex-col'>

      <div className='bg-[#A5925A] grid grid-cols-3 w-681 items-center px-10'>
            {/* Left-aligned logo and title */}
            <div className='p-5 text-lg lg:text-4xl w-max text-[#232323] font-bold flex items-center pl-1'>
                {/* Website Logo */}
                <img src="/logo.png" alt="Website Logo" className="w-12 h-12" /> {/* Adjust size as needed */}
                <div className= 'p-2 text-md'>
                  Team Sync <span className='pt-0 pb-4 pl-0 text-lg font-normal text-[#003056]'> for Junior Design</span>
                </div>
              </div>
            <div></div>
            <div className='pt-5 pb-5 pr-4 text-sm lg:text-lg justify-self-end text-[#003056] flex gap-5 items-center'>
              
              <div className="flex items-center gap-2">
                <div>{name}</div>
                
                <Button
                  onClick={() => setHamburgerOptionsOpen(!hamburgerOptionsOpen)}
                  className="flex bg-transparent hover:bg-transparent shadow-none hover:text[#054171] items-center justify-center text-2xl text-[#003056] hover:text-[#054171] font-bold px-3 pb-2 transition-all focus:outline-none">
                ☰</Button>
              </div>
  

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
                          console.log(`Rendering dropdown for ${section.title}:`, dropdownValues[section.title], ". Type: ", typeof dropdownValues[section.title]),
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
                              sectionName={section.title} // Pass section name to the dropdown
                              value={dropdownValues[section.title] || "2"} // Use stored value or default to "3"
                              onChange={(newValue) => handlePriorityChange(section.title, newValue)} // Pass sectionName and newValue
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
                              <div>

                                  <div className='flex pb-3 border-b-2 border-[#A5925A] text-xl text-[#003056]'>

                                    <div className='font-bold text-nowrap'>Team {teamNumber} - </div>

                                    <div className=' ml-1 text-nowrap'>{teams.projectName}</div>

                                    <div className='flex w-full justify-end'>
                                      <div className='font-bold'>Client:</div>
                                      <div className='ml-1'>{teams.clientName}</div>
                                    </div>


                                  </div>


                                  <div className='flex flex-col'>

                                    <div className='pt-3 text-xl text-[#003056] font-bold text-nowrap'>Team Section Preferences</div>

                                    {Object.keys(teamMembers).length > 0 ? (
                                        Object.entries(teamMembers).map(([name, choices]) => (
                                          <div key={name} className='text-lg mt-3 flex items-center'>
                                            <div className='flex w-max items-center text-[#003056]'>
                                              <div className='w-auto'>{name}:</div>
                                      
                                              {/* First Choice */}
                                              {choices.firstChoice === null ? (
                                                <span className="ml-2 italic">Undefined</span>
                                              ) : (
                                                JSON.parse(choices.firstChoice).map((section, index) => (
                                                  <span key={index} className="ml-2 font-bold">{section}</span>
                                                ))
                                              )}
                                      
                                              {/* Second Choice */}
                                              {choices.secondChoice !== null && JSON.parse(choices.secondChoice).length > 0 && (
                                                <>
                                                  <span className="ml-2">|</span>
                                                  {JSON.parse(choices.secondChoice).map((section, index) => (
                                                    <span key={index} className="ml-2">{section}</span>
                                                  ))}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p>Loading information...</p>
                                      )}



                                  </div>
                                  <div className='pt-6 text-xl text-[#003056] font-bold text-nowrap'>Ideal Section for Your Group</div>
                                  <div className='text-lg mt-2 text-[#003056]'>
                                    {typeof everyoneFilled !== "undefined" ? (
                                      !everyoneFilled ? (
                                        <p>Not everyone in the group has filled out their preferences!</p>
                                      ) : idealSection ? (
                                        <p>
                                          The ideal section is{" "}
                                          <span className="font-bold text-[#A5925A]">{idealSection}</span>.
                                        </p>
                                      ) : (
                                        <p>No ideal section could be determined.</p>
                                      )
                                    ) : (
                                      <p>Loading group preferences...</p>
                                    )}
                                  </div>




                              </div>

                  </div>


              </div>

          </div>





          {/* Buttons */}
          <div className='row-span-1 grid grid-cols-10'>


              <button className='col-span-2 text-[#003056] font-bold text-2xl bg-[#A5925A] px-3 py-2 mt-0 rounded-3xl hover:bg-[#003056] hover:text-white' onClick={handleSavePreferences}>Save Preferences</button>

              <button 
                  onClick={() => setLeaveTeamOpen(true)}
                  className='col-span-2 text-[#003056] col-start-9 font-bold text-2xl bg-[#A5925A] px-3 py-2 mt-0 rounded-3xl hover:bg-[#003056] hover:text-white'>Leave Team</button>


          </div>

          {/* Save Preferences PopUp */}
          {savePrefOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
                <p>Saved!</p>
                <button 
                  //onClick={() => setSavePrefOpen(!savePrefOpen)}
                  onClick={() => {
                    setSavePrefOpen(false);
                    window.location.reload();  // Refresh the page
                  }}
                  className="mt-4 px-4 py-2 bg-[#003056] text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}

    {settingsOpen && (
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
    
            <div className='flex items-center'>
              <label className="font-bold w-1/3 mr-1">Client Name:</label>
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Enter Client Name"
                className="border border-gray-300 p-2 rounded-md w-2/3"
              />
            </div>
    
            <div className='flex items-center'>
              <label className="font-bold w-1/3 mr-1">Project Name:</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter Project Name"
                className="border border-gray-300 p-2 rounded-md w-2/3"
              />
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
                  handleSavedSettings();
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
                        onClick={() => setLogoutOpen(false)}
                        className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                      >
                        Go Back
                      </Button>
                      <Button
                        onClick={() => {
                          setLogoutOpen(false);
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

      {leaveTeamOpen && (
            <div className="fixed text-[#003056] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
                <h2 className="text-xl font-bold mb-4">Are You Sure You Want to Leave Your Team?</h2>
    
                  <div className='flex gap-5 justify-center font-bold'>
    
                      <Button
                        onClick={() => setLeaveTeamOpen(false)}
                        className="mt-4 px-4 py-2 bg-[#A5925A] hover:bg-[#C1AC6F] rounded-md"
                      >
                        No
                      </Button>
                      <Button
                        onClick={() => {
                          setLeaveTeamOpen(false);
                          startLeaveTeam();
                        }}
                        className="mt-4 px-4 py-2 bg-[#D01717] hover:bg-[#EA2020] text-white rounded-md"
                      >
                        Yes
                      </Button>
              </div>



            </div>
            
        </div>
      )}

      </div>


    </div>
  );
}
