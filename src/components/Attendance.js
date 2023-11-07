import Papa from 'papaparse';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { db } from '@/config/firebase';
import { useEffect, useState,useRef } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp,WriteBatch, where, doc,updateDoc, getDocs, writeBatch} from 'firebase/firestore';
import CSVReader from 'react-csv-reader'
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

import { BsFillPersonVcardFill} from "react-icons/bs";
import { BiArrowToRight} from "react-icons/bi";
import { HiViewGridAdd} from "react-icons/hi";
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>


function Attendance ({attendance,meeting,scholars}) {

    const [selectedMeetingId, setSelectedMeetingId] = useState();
    const [attend, setAttend] = useState([]);
    const [addMeeting, setAddMeeting] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [saveFileAs , setSaveFileAs] = useState("");
    const [saveDateAs , setSaveDateAs] = useState("");
 
    const [errorMessage, setErrorMessage] = useState();
    const [errorMessage2, setErrorMessage2] = useState();
    const [isShaking, setIsShaking] = useState(false);
    const [isShaking2, setIsShaking2] = useState(false);
    

    

    const handleAddMeetingChange = (e) => {
        setAddMeeting(e.target.value);
    };
    const handleAttendChange = (e) => {
        setIdNumber(e.target.value);
    };
    
    const handleAttendClick = async (event) => {
        event.preventDefault();
        try{
            const users =scholars.filter((scholar) => {
                return scholar.id_no == idNumber;
              });
            if (users.length==0){
              setErrorMessage2('*No scholar found!');
              setIsShaking2(true);
    
              // Clear the error message and reset the shake animation after a short delay
                 setTimeout(() => {
                setErrorMessage2('');
                setIsShaking2(false);
                setIdNumber("");
              }, 2000); // Adjust the duration as needed

              
            }
            else {
                const attendCollection = collection(db, 'attendance');
                const filteredAttendance = attend.map(attend => {
                    // Calculate the conditional uid based on the provided condition
                    const id_no = attend.id_no;
                    console.log(id_no)
                    // Find a matching uid based on the calculated uid
                    const matchingid = scholars.find(scholar => scholar.id_no === id_no);
                    console.log("matching",matchingid)
                    if (matchingid) {
                    // If a matching uid is found, update Name
                    return {
                        ...attend,
                        name: matchingid.name,
                        cluster: matchingid.cluster
                    };
                    }
                
                    return attend;
                }); // Return the original history if no match is found
                if (filteredAttendance.length>=1){
                setErrorMessage2('*Scholar already attended!');
                setIsShaking2(true);

        
                // Clear the error message and reset the shake animation after a short delay
                    setTimeout(() => {
                    setErrorMessage('');
                    setIsShaking2(false);
                    setIdNumber("");
                    }, 2000); // Adjust the duration as needed
                }
                else{
                    const attendData = {
                    id_no: idNumber,
                    meetID: selectedMeetingId, 
                    status:"Present",
                    dateTime: serverTimestamp()
                    };
                    addDoc(attendCollection, attendData);
                    setErrorMessage2("Scholar "+ idNumber + "Attended")
                    setTimeout(() => {
                        setErrorMessage2("");
                        setIdNumber("");
                    }, 2000); // Adjust the duration as needed                    
                }
            }
        }
        catch{
            setErrorMessage2('*ERROR!');
            setIsShaking2(true);
  
            // Clear the error message and reset the shake animation after a short delay
               setTimeout(() => {
              setErrorMessage2('');
              setIsShaking2(false);
              setIdNumber("");
            }, 2000); // Adjust the duration as needed
            
        }

    };
 

    const handleAddMeeting = async (event) =>{
        event.preventDefault();
        const randomArray = new Uint32Array(4); 
        crypto.getRandomValues(randomArray);
        const randomString = Array.from(randomArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
        try{
              const meetingCollection = collection(db, 'meeting');
              const meet =meeting.filter((meet) => {
                return meet.meetName == addMeeting;
              });
              if (meet.length>=1){
                setErrorMessage('*Meeting Name Already Taken!');
                setIsShaking(true);
      
                // Clear the error message and reset the shake animation after a short delay
                   setTimeout(() => {
                  setErrorMessage('');
                  setIsShaking(false);
                  setAddMeeting("");
                }, 2000); // Adjust the duration as needed
                
              }
              else {
                Swal.fire({
                    title: 'Confirm Add Meeting?',
                    icon: 'warning',
                    iconColor: '#d33',
                    showCancelButton: true,
                    confirmButtonColor: '#000080',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const meetingData = {
                      meetID: randomString,
                      meetName: addMeeting, 
                      meetDate: serverTimestamp()
                      };
                      addDoc(meetingCollection, meetingData);
                      Swal.fire({
                        title: 'Adding Meeting Success!',
                        icon: 'success',
                        confirmButtonColor: '#000080',
                        iconColor: '#000080',
                      });
                      setAddMeeting("");
                    }
                  })
              }
        }
        catch{
            setErrorMessage('*ERROR!');
            setIsShaking(true);
  
            // Clear the error message and reset the shake animation after a short delay
               setTimeout(() => {
              setErrorMessage('');
              setIsShaking(false);
              setAddMeeting("");
            }, 2000); // Adjust the duration as needed

        }
    }
    function formatTimestamp(timestamp) {
        if (timestamp == null) {
            return ""; // Handle null timestamp as per your requirements
        }
    
        const date = timestamp.toDate();
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Include AM/PM
        };
    
        return date.toLocaleString(undefined, options);
    }
    useEffect(() => {
    const filteredAttend = attendance.filter((attend) => attend.meetID === selectedMeetingId);
    setAttend(filteredAttend);

  }, [attendance, selectedMeetingId]);

   

    const filteredAttendance = attend.map(attend => {
        // Calculate the conditional uid based on the provided condition
        const id_no = attend.id_no;
        const meetID =attend.meetID;
        const formattedDateTime = formatTimestamp(attend.dateTime);
        console.log(id_no)
        // Find a matching uid based on the calculated uid
        const matchingid = scholars.find(scholar => scholar.id_no === id_no);
        const meetingMatch =meeting.find(meet => meet.meetID === meetID)
        console.log("matching",matchingid)
        if (matchingid) {
        // If a matching uid is found, update Name
        return {
            ...attend,
            name: matchingid.name,
            cluster: matchingid.cluster,
            meetName: meetingMatch.meetName,
            formattedDateTime: formattedDateTime,
        };
        }
        
        return attend; // Return the original history if no match is found
    });

    useEffect(() => {
        // Check if there is at least one element in the filteredAttendance array
        if (filteredAttendance.length > 0) {
            setSaveFileAs(filteredAttendance[0].meetName);
            setSaveDateAs(filteredAttendance[0].formattedDateTime); // Set the value based on the first element's meetName property
        } else {
            // Handle the case where the array is empty or there is no match
            setSaveFileAs("");
        }
    }, [filteredAttendance]);

    const handleMeetingClick = (meetId) => {
        setSelectedMeetingId(meetId); // Update the state with the selected meeting ID
    };
    console.log("filtered",filteredAttendance)
    console.log('name', saveFileAs)
      const exportDataToCSV = () => {
        
        const data = filteredAttendance.map(attend => {
          const { id, meetID, ...rest } = attend; // Exclude the 'id' property
            
          return {
            meetName:attend.meetName,
            id_no: attend.id_no,
            name: attend.name, // Make 'id_no' the first cell
            ...rest,
          };
        });
      
        // Convert data to CSV format
        const csvData = Papa.unparse(data);
      
        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      
        // Save the CSV data as a file
        saveAs(blob, saveFileAs+'_Attendance_'+saveDateAs+'.csv');
      };

    return (
        <div>
            <div className="w-full h-full">
                <h1 className='text-2xl font-semibold font-montserrat text-blue-900'>
                    Attendance
                </h1>
                <hr className="h-1 my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
                {/* count */}
                <div className="grid grid-cols-3 divide-x-2 items-center justify-center text-center font-montserrat text-blue-900">
                    <div className="">
                        <p className="text-6xl ">20</p>
                        <p className="text-gray-300 ">Scholar/s</p>
                    </div>
                    <div className="">
                        <p className="text-6xl ">20</p>
                        <p className="text-gray-300 ">SASO Present</p>
                    </div>
                    <div className="">
                        <p className="text-6xl ">0</p>
                        <p className="text-gray-300 ">Others Present</p>
                    </div>
                </div>
                {/* add meeting and attendance */}
                <div className="w-full h-full flex justify-between mt-3">
                    <div className="w-2/6">
                    <label  className="block -mt-3 ps-1 text-sm font-medium text-gray-900 dark:text-gray-300">Add Meeting</label>
                        <form className={`${isShaking? "shake text-red-500":""} flex items-center text-gray-900 `} onSubmit={handleAddMeeting}>   
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <HiViewGridAdd/>
                                    </svg>
                                </div>
                                <input type="text" 
                                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-900 dark:focus:border-blue-900" 
                                    placeholder="Add Meeting..." 
                                    onChange={handleAddMeetingChange}
                                    value={addMeeting}
                                    required/>
                            </div>
                            <button type="submit" className="ml-2 font-medium  text-blue-950 px-1 ">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <HiViewGridAdd/>
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </form>
                        {isShaking?(<p className='shake text-red-500 text-sm'>{errorMessage}</p>):null}
                    </div>
                    <div className=''>
                    {isShaking2?(<p className='shake text-red-500 text-sm'>{errorMessage2}</p>):null}
                    </div>
                    <div className="w-2/6">
                    <label  className="block -mt-3 ps-1 text-sm font-medium text-gray-900 dark:text-gray-300">Enter ID Number</label>
                        <form className={`${isShaking2? "shake text-red-500":""}flex items-center text-gray-900`} onSubmit={handleAttendClick}>   
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <BsFillPersonVcardFill/>
                                    </svg>
                                </div>
                                <input type="text" 
                                className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-900 dark:focus:border-blue-900" 
                                placeholder="Enter ID Number..."
                                onChange={handleAttendChange}
                                value={idNumber}
                                required
                                disabled={selectedMeetingId==null?true:null}/>
                            </div>
                            <button type="submit" className="ml-2 text-sm font-medium text-blue-950">
                                <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <BsFillPersonVcardFill/>
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </form>
                    </div>
                </div>
                {/* table */}
                <div className="w-full h-[350px] flex justify-between mt-3">
                    <div className="w-2/6">
                        <div className="w-full h-full flex flex-col">
                            {meeting.length > 0?
                            <>
                            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                                <div className="flex-1 p-2 text-sm text-left">Meeting</div>
                            </div>
                            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
                            {meeting.map((meet) => (
                                <div
                                key={meet.id}
                                className={`flex hover:bg-gray-300 hover:bg-opacity-75 ${selectedMeetingId === meet.meetID ?"bg-gray-300 bg-opacity-75" :""}  text-lg font-semibold p-2`}
                                >
                                    <div className="flex text-start flex-1 truncate text-sm text-blue-950"
                                        onClick={() => handleMeetingClick(meet.meetID)}>
                                    <span className='w-full truncate'>{meet.meetName}</span>
                                    </div>
                                    {selectedMeetingId === meet.meetID && (
                                      
                                        <svg
                                        className="w-5 h-5 text-blue-950"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                        >
                                        <BiArrowToRight/>
                                        </svg>
                                    )}
                                </div>
                            ))}
                            </div>
                            </>:
                            <div className='w-full h-full justify-center items-center text-center text-5xl text-blue-950 font-bold'>
                                <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                                    <div className="flex-1 p-2 text-sm text-left">Meeting</div>
                                </div>      
                                No Data Available<br/>•ω•
                            </div>}
                        </div>
                    </div>
                    <div className="w-3/6">
                        <div className="w-full h-full flex flex-col">
                            {filteredAttendance.length > 0?
                            <>
                            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                                <div className="flex-1 p-2 text-sm text-left">ID No.</div>
                                <div className="flex-1 p-2 text-sm text-left">Name</div>
                                <div className="flex-1 p-2 text-sm text-center">Cluster</div>
                                <div className="flex-1 p-2 text-sm text-center">Status</div>
                                <div className="flex-1 p-2 text-sm text-left">DateTime</div>
                            </div>
                            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
                            {filteredAttendance.map((attend) => (
                                <div
                                key={attend.id}
                                className={`flex hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2`}
                                >
                                    <div className="flex text-start flex-1 truncate text-sm text-blue-950">
                                    <span className='w-full truncate'>{attend.id_no}</span>
                                    </div>
                                    <div className="flex text-start flex-1 truncate text-sm text-blue-950">
                                    <span className='w-full truncate'>{attend.name}</span>
                                    </div>
                                    <div className="flex flex-1 truncate text-center text-sm text-blue-950">
                                    <span className='w-full truncate'>{attend.cluster}</span>
                                    </div>
                                    <div className="flex flex-1 truncate text-center text-sm text-blue-950">
                                    <span className='w-full truncate'>{attend.status}</span>
                                    </div>
                                    <div className="flex text-start flex-1 truncate text-sm text-blue-950">
                                    <span className='w-full truncate'>{formatTimestamp(attend.dateTime)}</span>
                                    </div>
                                </div>
                            ))}
                            </div>
                            </>:
                            <div className='w-full h-full justify-center items-center text-center text-5xl text-blue-950 font-bold'>
                                <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                                <div className="flex-1 p-2 text-sm text-left">ID No.</div>
                                <div className="flex-1 p-2 text-sm text-left">Name</div>
                                <div className="flex-1 p-2 text-sm text-left">Cluster</div>
                                <div className="flex-1 p-2 text-sm text-left">DateTime</div>
                                </div>      
                                <div className='text-lg'> No Data Available<br/>•ω•</div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className='w-full h-full justify-between flex mt-2'>
                    <div className='w-full h-full'>
                        <button
                            class="text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Confirm Meeting
                        </button>
                    </div>
                    <div className='w-full h-full '>
                        <button
                            class=" text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={exportDataToCSV}>
                            Extract Attendance
                        </button>
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default Attendance;