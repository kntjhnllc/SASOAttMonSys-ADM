
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { db } from '@/config/firebase';
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc,updateDoc, getDocs} from 'firebase/firestore';
import { exportPathMap } from '../../next.config';
import Swal from 'sweetalert2';
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>


function Users ({users}) {
    
    const [selectedFilter, setSelectedFilter] = useState('All Users');
    const [access, setAccess] = useState(0);
    const [denied, setDenied] = useState(0);
    const userCount = users.length;

    useEffect(() => {
        let filteredUsersAccess,filteredUsersDenied;
      
          filteredUsersAccess = users.filter(user => user.access==true).length;
          filteredUsersDenied = users.filter(user => user.access==false).length;
         // Set the filtered users in the access state
        setAccess(filteredUsersAccess);
        setDenied(filteredUsersDenied);

      }, [users]);

    return (
        <div className="w-full h-full overflow-y-auto">
            <h1 className='text-2xl font-semibold font-montserrat text-blue-900'>Users</h1>
            <hr className="h-1 my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
            {/* count */}
            <div className="grid grid-cols-3 divide-x-2 items-center justify-center text-center font-montserrat text-blue-900">
                <div className="">
                    <p className="text-8xl ">{userCount}</p>
                    <p className="text-gray-300 ">Peoples</p>
                </div>
                <div className="">
                    <p className="text-8xl ">{access}</p>
                    <p className="text-gray-300 ">Access</p>
                </div>
                <div className="">
                    <p className="text-8xl ">{denied}</p>
                    <p className="text-gray-300 ">Denied</p>
                </div>
            </div>
            {/* search bar */}
            <div className="pt-7 flex items-center justify-center">
                <div className="w-5/6">
                    <form class="flex items-center">   
                        <label for="simple-search" class="sr-only">Search</label>
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-900 dark:focus:border-blue-900" placeholder="Search user..." required/>
                        </div>
                        <button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-900 rounded-lg border border-blue-900 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span class="sr-only">Search</span>
                        </button>
                    </form>
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
                                    onClick={() => setSelectedFilter('All Users')} // Set selected filter
                                    className={`
                                    ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                    block px-4 py-2 text-sm w-full text-end
                                    `}
                                >
                                    All Users
                                </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                <button
                                    onClick={() => setSelectedFilter('Access')} // Set selected filter
                                    className={`
                                    ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                    block px-4 py-2 text-sm w-full text-end
                                    `}
                                >
                                    Access
                                </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                <button
                                    onClick={() => setSelectedFilter('Denied')} // Set selected filter
                                    className={`
                                    ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                    block px-4 py-2 text-sm w-full text-end
                                    `}
                                >
                                    Denied
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
            {selectedFilter === 'All Users' && <AllUsers users={users} />}
            {selectedFilter === 'Access' && <AccessUsers users={users} />}
            {selectedFilter === 'Denied' && <DeniedUsers users={users} />}
            </div>
        </div>
    )
}

const AllUsers = ({users}) => {

    const changeAccess = (uid,email) => async (event) => {
        const isChecked = event.target.checked;
        const collectionRef = collection(db, 'admin_users');
        const queryRef = query(collectionRef, where('uid', '==', uid));

        const querySnapshot = await getDocs(queryRef);

        if (isChecked) {
            Swal.fire({
                title: 'Give Access?',
                text: "Do you want to give access to " +email+"?",
                icon: 'warning',
                iconColor: '#d33',
                showCancelButton: true,
                confirmButtonColor: '#000080',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, give access!'
              }).then((result) => {
                if (result.isConfirmed) {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, { access: isChecked });
                    });
                    Swal.fire({
                        title:'Access Taken!',
                        text:'Access has been taken away.',
                        icon:'success',
                        iconColor:'#000080',
                        confirmButtonColor:'#000080'
                    })
                }
              })
        } else {
            Swal.fire({
                title: 'Take Access?',
                text: "Do you want to take the access of " +email+"?",
                icon: 'warning',
                iconColor: '#d33',
                showCancelButton: true,
                confirmButtonColor: '#000080',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, take access!'
              }).then((result) => {
                if (result.isConfirmed) {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, { access: isChecked });
                    });
                    Swal.fire({
                        title:'Access Taken!',
                        text:'Access has been taken away.',
                        icon:'success',
                        iconColor:'#000080',
                        confirmButtonColor:'#000080'
                    })
                }
              })
        }
      };

    function formatTimestamp(timestamp) {
        if (timestamp == null) {
          const now = new Date();
          const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Include AM/PM
          };
          return now.toLocaleString(undefined, options);
        } else {
          const date = timestamp.toDate();
          const now = new Date();
          const diff = Math.floor((now - date) / 1000);  // Calculate difference in seconds
      
          if (diff < 60) {
            return `${diff} seconds ago`;
          } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
          } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
          } else if (diff <= 5 * 86400) {
            const days = Math.floor(diff / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
          } else {
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
        }
      }

    return (
        <div className="w-full h-full flex flex-col">
            {users.length > 0?
            <>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
              <div className="flex-1 p-2 text-left">Name</div>
              <div className="flex-1 p-2 text-left">Email</div>
              <div className="flex-1 p-2">Date Created</div>
              <div className="flex-1 p-2">Accessibility</div>
              <div className="flex-1 p-2">Status</div>
            </div>
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2"
                >
                  <div className="flex flex-1 items-center truncate">
                  
                  <span className='w-full truncate'>{user.name}</span>
                  </div>
                  <div className="flex-1 truncate">{user.email}</div>
                  <div className="flex-1 text-center whitespace-pre-wrap truncate">
                    {formatTimestamp(user.date_created)}
                  </div>
                <div className="flex-1 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        value="" 
                        class="sr-only peer" 
                        checked={user.access}
                        onChange={changeAccess(user.uid,user.email)} 
                        />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{user.access?"Access":"Denied"}</span>
                    </label>
                </div>
                  <div className="flex-1 truncate text-center">{user.verified?"Verified":"Not verified"}</div>
                  
                </div>
                
              ))}
            </div>
      
            </>:
            <div className='w-full h-full flex justify-center items-center text-center text-5xl text-[#415923] font-bold'>
            No Data Available<br/>•ω•
            </div>}
          </div>
    )
}

const AccessUsers = ({users}) => {

    const accessUsers =users.filter((user) => {
        return user.access == true;
      });

    const changeAccess = (uid,email) => async (event) => {
        const isChecked = event.target.checked;
        const collectionRef = collection(db, 'admin_users');
        const queryRef = query(collectionRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(queryRef);

        if (isChecked) {
            Swal.fire({
                title: 'Give Access?',
                text: "Do you want to give access to " +email+"?",
                icon: 'warning',
                iconColor: '#d33',
                showCancelButton: true,
                confirmButtonColor: '#000080',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, give access!'
              }).then((result) => {
                if (result.isConfirmed) {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, { access: isChecked });
                    });
                    Swal.fire({
                        title:'Access Taken!',
                        text:'Access has been taken away.',
                        icon:'success',
                        iconColor:'#000080',
                        confirmButtonColor:'#000080'
                    })
                }
              })
        } else {
            Swal.fire({
                title: 'Take Access?',
                text: "Do you want to take the access of " +email+"?",
                icon: 'warning',
                iconColor: '#d33',
                showCancelButton: true,
                confirmButtonColor: '#000080',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, take access!'
              }).then((result) => {
                if (result.isConfirmed) {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, { access: isChecked });
                    });
                  Swal.fire({
                    title:'Access Taken!',
                    text:'Access has been taken away.',
                    icon:'success',
                    iconColor:'#000080',
                    confirmButtonColor:'#000080'
                    })
                }
              })
        }
      };

    function formatTimestamp(timestamp) {
        if (timestamp == null) {
          const now = new Date();
          const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Include AM/PM
          };
          return now.toLocaleString(undefined, options);
        } else {
          const date = timestamp.toDate();
          const now = new Date();
          const diff = Math.floor((now - date) / 1000);  // Calculate difference in seconds
      
          if (diff < 60) {
            return `${diff} seconds ago`;
          } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
          } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
          } else if (diff <= 5 * 86400) {
            const days = Math.floor(diff / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
          } else {
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
        }
      }

    return (
        <div className="w-full h-full flex flex-col">
            {users.length > 0?
            <>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
              <div className="flex-1 p-2 text-left">Name</div>
              <div className="flex-1 p-2 text-left">Email</div>
              <div className="flex-1 p-2">Date Created</div>
              <div className="flex-1 p-2">Accessibility</div>
              <div className="flex-1 p-2">Status</div>
            </div>
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
              {accessUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2"
                >
                  <div className="flex flex-1 items-center truncate">
                  
                  <span className='w-full truncate'>{user.name}</span>
                  </div>
                  <div className="flex-1 truncate">{user.email}</div>
                  <div className="flex-1 text-center whitespace-pre-wrap truncate">
                    {formatTimestamp(user.date_created)}
                  </div>
                <div className="flex-1 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        value="" 
                        class="sr-only peer" 
                        checked={user.access}
                        onChange={changeAccess(user.uid,user.email)} 
                        />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{user.access?"Access":"Denied"}</span>
                    </label>
                </div>
                  <div className="flex-1 truncate text-center">{user.verified?"Verified":"Not verified"}</div>
                  
                </div>
                
              ))}
            </div>
      
            </>:
            <div className='w-full h-full flex justify-center items-center text-center text-5xl text-[#415923] font-bold'>
            No Data Available<br/>•ω•
            </div>}
          </div>
    )
}

const DeniedUsers = ({users}) => {

    const deniedUsers =users.filter((user) => {
        return user.access == false;
      });

    const changeAccess = (uid,email) => async (event) => {
        const isChecked = event.target.checked;
        const collectionRef = collection(db, 'admin_users');
        const queryRef = query(collectionRef, where('uid', '==', uid));

        const querySnapshot = await getDocs(queryRef);

        if (isChecked) {
            Swal.fire({
                title: 'Give Access?',
                text: "Do you want to give access to " +email+"?",
                icon: 'warning',
                iconColor: '#d33',
                showCancelButton: true,
                confirmButtonColor: '#000080',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, give access!'
              }).then((result) => {
                if (result.isConfirmed) {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, { access: isChecked });
                    });
                    Swal.fire({
                        title:'Access Taken!',
                        text:'Access has been taken away.',
                        icon:'success',
                        iconColor:'#000080',
                        confirmButtonColor:'#000080'
                    })
                }
              })
        } else {
            Swal.fire({
                title: 'Take Access?',
                text: "Do you want to take the access of " +email+"?",
                icon: 'warning',
                iconColor: '#d33',
                showCancelButton: true,
                confirmButtonColor: '#000080',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, take access!'
              }).then((result) => {
                if (result.isConfirmed) {
                    querySnapshot.forEach((doc) => {
                        updateDoc(doc.ref, { access: isChecked });
                    });
                    Swal.fire({
                        title:'Access Taken!',
                        text:'Access has been taken away.',
                        icon:'success',
                        iconColor:'#000080',
                        confirmButtonColor:'#000080'
                    })
                }
              })
        }
      };

    function formatTimestamp(timestamp) {
        if (timestamp == null) {
          const now = new Date();
          const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Include AM/PM
          };
          return now.toLocaleString(undefined, options);
        } else {
          const date = timestamp.toDate();
          const now = new Date();
          const diff = Math.floor((now - date) / 1000);  // Calculate difference in seconds
      
          if (diff < 60) {
            return `${diff} seconds ago`;
          } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
          } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
          } else if (diff <= 5 * 86400) {
            const days = Math.floor(diff / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
          } else {
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
        }
      }

    return (
        <div className="w-full h-full flex flex-col">
            {users.length > 0?
            <>
            <div className="flex text-2xl  font-bold bg-blue-950 text-center text-white  rounded-t-xl">
              <div className="flex-1 p-2 text-left">Name</div>
              <div className="flex-1 p-2 text-left">Email</div>
              <div className="flex-1 p-2">Date Created</div>
              <div className="flex-1 p-2">Accessibility</div>
              <div className="flex-1 p-2">Status</div>
            </div>
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2">
              {deniedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2"
                >
                  <div className="flex flex-1 items-center truncate">
                  
                  <span className='w-full truncate'>{user.name}</span>
                  </div>
                  <div className="flex-1 truncate">{user.email}</div>
                  <div className="flex-1 text-center whitespace-pre-wrap truncate">
                    {formatTimestamp(user.date_created)}
                  </div>
                <div className="flex-1 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        value="" 
                        class="sr-only peer" 
                        checked={user.access}
                        onChange={changeAccess(user.uid,user.email)} 
                        />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{user.access?"Access":"Denied"}</span>
                    </label>
                </div>
                  <div className="flex-1 truncate text-center">{user.verified?"Verified":"Not verified"}</div>
                  
                </div>
                
              ))}
            </div>
      
            </>:
            <div className='w-full h-full flex justify-center items-center text-center text-5xl text-[#415923] font-bold'>
            No Data Available<br/>•ω•
            </div>}
          </div>
    )
}

export default Users;


