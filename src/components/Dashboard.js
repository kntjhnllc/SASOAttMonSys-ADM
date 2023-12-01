
import Papa from 'papaparse';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {auth, db } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState,useRef } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp,WriteBatch, where, doc,updateDoc, getDocs, writeBatch, or, QuerySnapshot} from 'firebase/firestore';
import CSVReader from 'react-csv-reader'
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import AddScholarModal from '../components/AddScholarModal';
import { BsPersonFillAdd} from "react-icons/bs";
import { FaRegEdit} from "react-icons/fa";
import { BiDotsVerticalRounded} from "react-icons/bi";
import { MdOutlineBatchPrediction,MdEditDocument,MdManageAccounts} from "react-icons/md";


<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>


function Dashboard ({announcement,calendarSrc,scholars,setLoadUsers,setLoadAnnouncement,user}) {

    const [openEdit, setOpenEdit] = useState(false);
    const [announceID, setAnnounceID] = useState('');
    const announceRef = useRef(null);

    useEffect(() => {
        setLoadUsers(true)
        setLoadAnnouncement(true)
        setAnnounceID(announcement[0]?.id)
      },[announcement]);

    const currentDateWithoutYear = new Date().toISOString().slice(5, 10); // Get current date without year in "MM-DD" format
    const bdayScholars = scholars.filter((scholar) => {
        const scholarDateWithoutYear = scholar.birthdate?.slice(5, 10);
       
        return scholarDateWithoutYear === currentDateWithoutYear;
    });

    const isAccess = scholars.filter((scholar) => {
       
        return scholar.uid == user?.uid && scholar.access==true;
    });
    
    const handleOnClickEdit = () =>{
        setOpenEdit(true);
        console.log("clicked")
    }
    
    const handleAnnouncementSave = async () => {
        const newAnnouncement = announceRef.current.innerHTML;
        console.log(announceID)
        console.log(newAnnouncement)
        try {
            const docRef = doc(db, 'announcement', announceID);
            await updateDoc(docRef, {
                announce: newAnnouncement
            });
            setOpenEdit(false);
            console.log('Announcement updated successfully!');
        } catch (error) {
            console.error('Error updating announcement:', error);
        }            
    }

    const handleClearAnnouncement = async () =>{
        try {
            const docRef = doc(db,"announcement",announceID);
            await updateDoc(docRef,{
                announce:""
            });
            setOpenEdit(false);
        }
        catch (error){
            console.error('Error clearing announcement:', error);
        }
    }
    return (
        <div className="h-full w-full">
            <h1 className='text-2xl font-semibold font-montserrat text-blue-900'>
                    Dashboard
            </h1>
            <hr className="h-1 my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className="bg-white flex flex-col p-2 shadow-lg rounded-xl font-montserrat w-full text-blue-900"> 
                <div className='flex w-full'>
                    <h1 className='font-extrabold'>NOTICE</h1>
                    <div className={`${isAccess !=false  && openEdit == false?"block":"hidden"} w-full flex justify-end`}>
                        <div className='cursor-pointer'>
                            <FaRegEdit onClick={()=>handleOnClickEdit()}/>
                        </div>
                    </div>
                </div>
                {openEdit?(
                    <div className='w-full h-full p-2'>
           
                            <div 
                                ref={announceRef}
                                class="p-2 max-w-full overflow-y-hidden break-words border border-solid border-blue-950 text-md mb-2" 
                                contenteditable="true">
                            </div>
                            <div className='flex w-full content-end justify-end '>
                                <button 
                                    onClick={()=>setOpenEdit(false)}
                                    class="mr-1 text-white place-self-end bg-gray-500 hover:bg-gray-700  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
                                        Cancel
                                </button>
                                <button 
                                    onClick={()=>handleClearAnnouncement()}
                                    class="mr-1 text-white place-self-end bg-red-700 hover:bg-red-900  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
                                        Clear
                                </button>
                                <button 
                                    onClick={()=>handleAnnouncementSave()}
                                    class=" text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
                                        Announce
                                </button>
                            </div>
                     
                    </div>
                    ):
                    <div className="text-center p-5">
                        {announcement[0]?.announce==""?"No Notice":announcement[0]?.announce}
                    </div>}
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full font-montserrat mt-3 text-blue-900">
                <div className="flex flex-col md:w-2/6 p-2 h-96 bg-white shadow-lg rounded-xl">
                    <h1>Birthdays Today:</h1>
                    {bdayScholars.length > 0?
                    <>
                    <div className="flex text-sm  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                    <div className="flex-1 p-2 text-left">Name</div>
                    <div className="flex-1 p-2">Organization</div>
                    </div>
                    <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
                    {bdayScholars.map((scholar) => (
                        <div
                        key={scholar.id}
                        className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-sm font-semibold p-2"
                        >
                        <div className="flex-1 truncate">{scholar.name}</div>
                        <div className="flex-1 truncate text-center uppercase">{scholar.organization}</div>
                        </div>
                    ))}
                    </div>
                    </>:
                    <div className='w-full h-full'>
                    <div className="flex text-sm   font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                    <div className="flex-1 p-2 text-left">Name</div>
                    <div className="flex-1 p-2">Organization</div>
                    </div>
                    <div className='w-full h-full  pt-20  text-center text-sm  text-blue-950 font-bold'>
                    No Scholar has birthday today.<br/>•ω•
                    </div>
                </div>
                    }
                </div>
                <div className="md:w-4/6 w-full mt-3 h-[400px] md:h-[360px] md:mt-0 md:ps-3 ">
                    <h1>Calendar of Activities</h1>
                    <div className="p-2 bg-white shadow-lg rounded-xl w-full h-full ">
                    <iframe className="h-full w-full z-30" src={calendarSrc} frameborder="0" scrolling="no"></iframe>
                    </div>
                </div>
            </div>
        </div>
      
    )
}

export default Dashboard;