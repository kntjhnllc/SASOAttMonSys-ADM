
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { db } from '@/config/firebase';
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc,updateDoc, getDocs} from 'firebase/firestore';
import { exportPathMap } from '../../next.config';
import Swal from 'sweetalert2';

function Scholars ({scholars}) {

    const [selectedFilter, setSelectedFilter] = useState('All Scholars');
    const [saso , setSaso] = useState();
    const [others , setOthers] = useState();
    const scholarCount = scholars.length;

    useEffect(() => {
        let filteredUsersSASO,filteredUsersOthers;
      
          filteredUsersSASO = scholars.filter(scholar => scholar.organization=="saso").length;
          filteredUsersOthers = scholars.filter(scholar => scholar.organization!="saso").length;
         // Set the filtered users in the access state
        setSaso(filteredUsersSASO);
        setOthers(filteredUsersOthers);

      }, [scholars]);

    return (
        <div className="">
        <h1 className='text-2xl font-semibold font-montserrat text-blue-900'>Scholars</h1>
        <hr className="h-1 my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
        {/* count */}
        <div className="grid grid-cols-3 divide-x-2 items-center justify-center text-center font-montserrat text-blue-900">
            <div className="">
                <p className="text-8xl ">{scholarCount}</p>
                <p className="text-gray-300 ">Scholar/s</p>
            </div>
            <div className="">
                <p className="text-8xl ">{saso}</p>
                <p className="text-gray-300 ">SASO</p>
            </div>
            <div className="">
                <p className="text-8xl ">{others}</p>
                <p className="text-gray-300 ">Others</p>
            </div>
        </div>
        {/* search bar */}
        <div className="pt-7 flex items-center justify-center">
            <div className="w-3/6">
                <form class="flex items-center">   
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-900 dark:focus:border-blue-900" placeholder="Search scholar..." required/>
                    </div>
                    <button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-900 rounded-lg border border-blue-900 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span class="sr-only">Search</span>
                    </button>
                </form>
            </div>
            {/* ADD SCHOLAR */}
            <div className='w-1/6 ps-5 '>
            <button type="button" data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" class=" text-white  bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Scholar</button>
            
            </div>
            
            {/* ADD SCHOLAR THROUGH CSV */}
            <div className='w-2/6'>

            </div>
            {/* FILTER */}
            <div className="w-1/6 ps-5">
                <Menu as="div" className="relative inline-block text-left w-full">
                    <div>
                    <Menu.Button className="inline-flex w-full justify-end gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {selectedFilter} {/* Show the selected filter */}
                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                    </div>

                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                            <button   
                                onClick={() => setSelectedFilter('All Scholars')} // Set selected filter
                                className={`
                                ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                block px-4 py-2 text-sm w-full text-end
                                `}
                            >
                                All Scholars
                            </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                            <button
                                onClick={() => setSelectedFilter('SASO')} // Set selected filter
                                className={`
                                ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                block px-4 py-2 text-sm w-full text-end
                                `}
                            >
                                SASO
                            </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                            <button
                                onClick={() => setSelectedFilter('Others')} // Set selected filter
                                className={`
                                ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                block px-4 py-2 text-sm w-full text-end
                                `}
                            >
                                Others
                            </button>
                            )}
                        </Menu.Item>
                        </div>
                    </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
        <div className='w-full h-full py-5'>
        {selectedFilter === 'All Scholars' && <AllScholars scholars={scholars} />}
        {selectedFilter === 'SASO' && <SASOScholars scholars={scholars} />}
        {selectedFilter === 'Others' && <OtherScholars scholars={scholars} />}
        </div>
    </div>
    )

}

const AllScholars = ({scholars}) => {

    return (
        <div className="w-full h-full flex flex-col">
            {scholars.length > 0?
            <>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
              <div className="flex-1 p-2 text-left">ID Num.</div>
              <div className="flex-1 p-2 text-left">Name</div>
              <div className="flex-1 p-2">Year Level</div>
              <div className="flex-1 p-2">Cluster</div>
              <div className="flex-1 p-2">Office</div>
              <div className="flex-1 p-2">Organization</div>
            </div>
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
              {scholars.map((scholar) => (
                <div
                  key={scholar.id}
                  className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2"
                >
                  <div className="flex flex-1 items-center truncate">
                  
                  <span className='w-full truncate'>{scholar.id_no}</span>
                  </div>
                  <div className="flex-1 truncate">{scholar.name}</div>
                  <div className="flex-1 truncate text-center">{scholar.year}</div>
                  <div className="flex-1 truncate text-center">{scholar.cluster}</div>
                  <div className="flex-1 text-sm text-center">{scholar.office}</div>
                  <div className="flex-1 truncate text-center uppercase">{scholar.organization}</div>
                </div>
                
              ))}
            </div>
      
            </>:
            <div className='w-full h-full'>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
            <div className="flex-1 p-2 text-left">ID Num.</div>
            <div className="flex-1 p-2 text-left">Name</div>
            <div className="flex-1 p-2">Year Level</div>
            <div className="flex-1 p-2">Cluster</div>
            <div className="flex-1 p-2">Office</div>
            <div className="flex-1 p-2">Organization</div>
            </div>
            <div className='w-full h-full  p-40  text-center text-5xl text-blue-950 font-bold'>
            No Data Available<br/>•ω•
            </div>
        </div>}
          </div>
    )
}


const SASOScholars = ({scholars}) => {
    const saso =scholars.filter((scholar) => {
        return scholar.organization == "saso";
      });
    return (
        <div className="w-full h-full flex flex-col">
            {saso.length > 0?
            <>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
              <div className="flex-1 p-2 text-left">ID Num.</div>
              <div className="flex-1 p-2 text-left">Name</div>
              <div className="flex-1 p-2">Year Level</div>
              <div className="flex-1 p-2">Cluster</div>
              <div className="flex-1 p-2">Office</div>
              <div className="flex-1 p-2">Organization</div>
            </div>
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
              {saso.map((scholar) => (
                <div
                  key={scholar.id}
                  className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2"
                >
                  <div className="flex flex-1 items-center truncate">
                  
                  <span className='w-full truncate'>{scholar.id_no}</span>
                  </div>
                  <div className="flex-1 truncate">{scholar.name}</div>
                  <div className="flex-1 truncate text-center">{scholar.year}</div>
                  <div className="flex-1 truncate text-center">{scholar.cluster}</div>
                  <div className="flex-1 text-sm text-center">{scholar.office}</div>
                  <div className="flex-1 truncate text-center uppercase">{scholar.organization}</div>
                </div>
                
              ))}
            </div>
      
            </>:
            <div className='w-full h-full'>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
            <div className="flex-1 p-2 text-left">ID Num.</div>
            <div className="flex-1 p-2 text-left">Name</div>
            <div className="flex-1 p-2">Year Level</div>
            <div className="flex-1 p-2">Cluster</div>
            <div className="flex-1 p-2">Office</div>
            <div className="flex-1 p-2">Organization</div>
            </div>
            <div className='w-full h-full  p-40  text-center text-5xl text-blue-950 font-bold'>
            No Data Available<br/>•ω•
            </div>
        </div>
            }
          </div>
    )
}

const OtherScholars = ({scholars}) => {
    const others =scholars.filter((scholar) => {
        return scholar.organization != "saso";
      });
    return (
        <div className="w-full h-full flex flex-col">
            {others.length > 0?
            <>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
              <div className="flex-1 p-2 text-left">ID Num.</div>
              <div className="flex-1 p-2 text-left">Name</div>
              <div className="flex-1 p-2">Year Level</div>
              <div className="flex-1 p-2">Cluster</div>
              <div className="flex-1 p-2">Office</div>
              <div className="flex-1 p-2">Organization</div>
            </div>
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
              {others.map((scholar) => (
                <div
                  key={scholar.id}
                  className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2"
                >
                  <div className="flex flex-1 items-center truncate">
                  
                  <span className='w-full truncate'>{scholar.id_no}</span>
                  </div>
                  <div className="flex-1 truncate">{scholar.name}</div>
                  <div className="flex-1 truncate text-center">{scholar.year}</div>
                  <div className="flex-1 truncate text-center">{scholar.cluster}</div>
                  <div className="flex-1 text-sm text-center">{scholar.office}</div>
                  <div className="flex-1 truncate text-center uppercase">{scholar.organization}</div>
                </div>
                
              ))}
            </div>
      
            </>:
            <div className='w-full h-full'>
                <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
                <div className="flex-1 p-2 text-left">ID Num.</div>
                <div className="flex-1 p-2 text-left">Name</div>
                <div className="flex-1 p-2">Year Level</div>
                <div className="flex-1 p-2">Cluster</div>
                <div className="flex-1 p-2">Office</div>
                <div className="flex-1 p-2">Organization</div>
                </div>
                <div className='w-full h-full  p-40  text-center text-5xl text-blue-950 font-bold'>
                No Data Available<br/>•ω•
                </div>
            </div>
            }
          </div>
    )
}


export default Scholars;