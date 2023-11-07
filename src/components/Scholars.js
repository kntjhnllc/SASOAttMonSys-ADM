
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>

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
import AddScholarModal from '../components/AddScholarModal';

function Scholars ({scholars}) {

    const [selectedFilter, setSelectedFilter] = useState('All Scholars');
    const [saso , setSaso] = useState();
    const [others , setOthers] = useState();
    const [showAddScholar,setShowAddScholar] = useState(false);
    const scholarCount = scholars.length;

    const [errorMessage, setErrorMessage] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    const [id_no , setId_no] = useState ("");
    const [cluster , setCluster] = useState ("1");
    const [name , setName] = useState ("");
    const [office , setOffice] = useState ("");
    const [organization , setOrganization] = useState ("saso");
    const [year , setYear] = useState ("1");

    const [csvData, setCsvData] = useState([]);
    const fileInputRef = useRef(null);

    const handleId_noChange = (e) => {
      setId_no(e.target.value);
    };
    const handleClusterChange = (e) => {
      setCluster(e.target.value);
    };
    const handleNameChange = (e) => {
      setName(e.target.value);
    };
    const handleOfficeChange = (e) => {
      setOffice(e.target.value);
    };
    const handleOrganizationChange = (e) => {
      setOrganization(e.target.value);
    };
    const handleYearChange = (e) => {
      setYear(e.target.value);
    };

    useEffect(() => {
        let filteredUsersSASO,filteredUsersOthers;
      
          filteredUsersSASO = scholars.filter(scholar => scholar.organization=="saso").length;
          filteredUsersOthers = scholars.filter(scholar => scholar.organization!="saso").length;
         // Set the filtered users in the access state
        setSaso(filteredUsersSASO);
        setOthers(filteredUsersOthers);

      }, [scholars]);

      const handleFileUpload = (event) => {
        const file = event.target.files[0];
      
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            const csvData = result.data.map((rowData) => {
              // Convert each value in the row to a string
              const stringifiedRow = {};
              for (const key in rowData) {
                if (rowData.hasOwnProperty(key)) {
                  stringifiedRow[key] = String(rowData[key]);
                }
              }
              return stringifiedRow;
            });
      
            // Now, `csvData` contains all values as strings
            setCsvData(csvData);
          },
        });
      };
      
      const importUsersToFirestore =  (event) => {
        event.preventDefault();
        csvData.forEach(async(user) => {
          console.log("looptext")
          const scholarsCheck =scholars.filter((scholar) => {
            return scholar.id_no == user.id_no;
          });
          console.log(user.id_no)
          const usersCollection = collection(db, 'users');
          const queryRef = query(usersCollection, where('id_no', '==', user.id_no));
          const querySnapshot = await getDocs(queryRef);
          console.log(querySnapshot.size)
          const userData = {
            id_no: user.id_no,
            name: user.name,
            cluster: user.cluster, 
            office: user.office,
            year: user.year,
            organization: user.organization,
          };
          if (
            userData.id_no === "" ||
            userData.name === "" ||
            userData.cluster === "" ||
            userData.office === "" ||
            userData.year === "" ||
            userData.organization === "" ||
            userData.cluster >= 6 ||
            userData.year >= 5
          ) {
            setErrorMessage("*Some field are wrong. Skipping")
            setIsShaking(true);
            setTimeout(() => {
              setErrorMessage('');
              setIsShaking(false);
            }, 2000); // Adjust the duration as needed
          } else {
            if (scholarsCheck.length>=1){
              querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, {
                  name: user.name,
                  cluster: user.cluster, 
                  office: user.office,
                  year: user.year,
                  organization: user.organization,});
              });
              console.log("modified");
            } else {
            addDoc(usersCollection, userData);
            console.log("added");
            }
          }
          // Reset the file input value
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // This will clear the file input's value
          }
        });
      };


    const addScholar_Attempt = async (event)=> {
        event.preventDefault();
        try {
              const usersCollection = collection(db, 'users');
              const q = query(usersCollection, where('id_no', '==', id_no));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
              });
              if (!querySnapshot.empty){
                setErrorMessage('*ID number of scholar already registered!');
                setIsShaking(true);
      
                // Clear the error message and reset the shake animation after a short delay
                   setTimeout(() => {
                  setErrorMessage('');
                  setIsShaking(false);
                }, 2000); // Adjust the duration as needed
              }
              else{
                if (cluster!=''&&year!=''&&organization!=''){
                  Swal.fire({
                    title: 'Confirm Add Scholar?',
                    text: "Confirm adding " +id_no+" - " +name+"?",
                    icon: 'warning',
                    iconColor: '#d33',
                    showCancelButton: true,
                    confirmButtonColor: '#000080',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const userData = {
                      id_no: id_no,
                      name: name, 
                      cluster: cluster, 
                      office: office,
                      organization: organization,
                      year: year,
                      };
                      addDoc(usersCollection, userData);
                      Swal.fire({
                        title: 'Adding Scholar Success!',
                        icon: 'success',
                        confirmButtonColor: '#000080',
                        iconColor: '#000080',
                      });
                      setShowAddScholar(false)
                      setId_no('');
                      setCluster('1');
                      setName('');
                      setOffice('');
                      setOrganization('saso');
                      setYear('1');
                    }
                  })
                }
                else{
                  setErrorMessage('Empty values');
                  setTimeout(() => {
                    setErrorMessage('');  
                  }, 2000); // Adjust the duration as needed
                }
              }
        } catch (error) {
          console.log(error);
          setErrorMessage('ambot na error');
          setIsShaking(true);
      
          // Clear the error message and reset the shake animation after a short delay
          setTimeout(() => {
            setErrorMessage('');
            setIsShaking(false);
          }, 2000); // Adjust the duration as needed
        }
      }

    return (
      <Fragment>
      <div  className="relative flex flex-col w-full h-full">
        <div className="w-full h-auto absolute">
          <h1 className='text-2xl font-semibold font-montserrat text-blue-900 '>Scholars</h1>
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
              <div className='w-1/6 ps-5'>
                <button type="button"
              onClick={()=> setShowAddScholar(true)}
              class=" text-white  bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Add Scholar
                </button>
              
              </div>
              {/* ADD SCHOLAR THROUGH CSV */}
              <div className='w-2/6 '>
                <label class="block -mt-3 ps-1 text-sm font-medium text-gray-900 dark:text-gray-300" for="file_input">Batch Adding - .csv files</label>
                <form Method="Post" onSubmit={importUsersToFirestore} className={`${isShaking? 'shake' :''}`}>
                  <div className='flex'>
                    <div className=""> 
                      <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" 
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      required
                    />
                    </div>
                    <div className='ps-2 -mt-2'>
                      <button
                      class=" text-white  bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm py-2.5 px-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                      Batch Add
                      </button>
                    </div>
                    
                  </div>
                  <p className='text-red-600 text-sm'>{errorMessage}</p>
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
        </div>
        <div className='h-[600px] w-full pt-[270px]'>
          <div className='w-full h-full py-5 '>
          {selectedFilter === 'All Scholars' && <AllScholars scholars={scholars} />}
          {selectedFilter === 'SASO' && <SASOScholars scholars={scholars} />}
          {selectedFilter === 'Others' && <OtherScholars scholars={scholars} />}
          </div>
        </div>
      </div>
    {/* ADD SCHOLAR CONTENT */}
    <AddScholarModal isVisible={showAddScholar} onClose={()=> setShowAddScholar(false)}>
    <div className='py-6 px-6 lg:px-8 text-left'>
      <h3 className='mb-4 text-xl font-medium text-blue-900'>
        Add Scholar Information
      </h3>
      <form className={`space-y-6 text-gray-900 ${isShaking ? 'shake text-red-500' : ''}`} onSubmit={addScholar_Attempt} method='POST'>
        <div className="flex">
          <div className="flex flex-col mr-4 w-4/6">
            <label htmlFor="id_no" className="text-sm font-medium  mb-2">
              ID Number
            </label>
            <input
              type="text"
              name="id_no"
              id="id_no"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 p-2.5"
              placeholder="ID Number"
              onChange={handleId_noChange}
              required
            />
          </div>
          <div className="flex flex-col w-2/6">
            <label htmlFor="cluster" className="text-sm font-medium text-gray-900 mb-2">
              Cluster
            </label>
            <select
              name="cluster"
              id="cluster"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 p-2.5"
              onChange={handleClusterChange}
              required
              defaultValue="1"
            >
              <option value="1">Cluster 1</option>
              <option value="2">Cluster 2</option>
              <option value="3">Cluster 3</option>
              <option value="4">Cluster 4</option>
              <option value="5">Cluster 5</option>
            </select>
          </div>
        </div>
        <p className='text-red-600 text-sm'>{errorMessage}</p>
        <div>
          <label 
            for='name'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Full Name
          </label>
          <input
            type='text'
            name='name'
            id="name"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5'
            placeholder='Full Name'
            onChange={handleNameChange}
            required
          />  
        </div>    
        <div>
          <label 
            for='office'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Office
          </label>
          <input
            type='text'
            name='office'
            id="office"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5'
            placeholder='Office'
            onChange={handleOfficeChange}
            required
          />  
        </div>    
        <div className="flex">
          <div className="flex flex-col mr-4 w-4/6">
            <label htmlFor="id_no" className="text-sm font-medium text-gray-900 mb-2">
              Organization
            </label>
            <select
              name="organization"
              id="organization"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 p-2.5"
              onChange={handleOrganizationChange}
              required
              defaultValue="saso"
            >
              <option value="saso">SASO</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="flex flex-col w-2/6">
            <label htmlFor="cluster" className="text-sm font-medium text-gray-900 mb-2">
              Year Level
            </label>
            <select
              name="year"
              id="year"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 p-2.5"
              onChange={handleYearChange}
              required
              defaultValue="1"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>
        <div className='flex flex-col ps-3'>
            <button
             class=" w-3/6  text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Add Scholar
              </button>
          </div>
      </form>
    </div>
   </AddScholarModal>
    </Fragment>
    )

}

const AllScholars = ({scholars}) => {

  const exportDataToCSV = () => {
  
    const data = scholars.map(scholar => {
      const { id, ...rest } = scholar; // Exclude the 'id' property
      return {
        id_no: scholar.id_no,
        name: scholar.name, // Make 'id_no' the first cell
        ...rest,
      };
    });
  
    // Convert data to CSV format
    const csvData = Papa.unparse(data);
  
    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  
    // Save the CSV data as a file
    saveAs(blob, 'exported_data_All_Scholars.csv');
  };

    return (
        <div className="w-full h-full flex flex-col relative">
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
            <div className="w-full h-full overflow-y-auto border-s-2 border-e-2 border-b-2 relative group">
              {scholars.map((scholar) => (
                <div
                  key={scholar.id}
                  className="flex items-center  mb-2 hover:bg-gray-300 hover:bg-opacity-75  text-lg font-semibold p-2 "
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
            <div className='place-self-end w-1/6 pt-2'>
              <button
              onClick={exportDataToCSV}
                class=" w-3/6  text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Extract Data
              </button>
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

      const exportDataToCSV = () => {
  
        const data = saso.map(scholar => {
          const { id, ...rest } = scholar; // Exclude the 'id' property
          return {
            id_no: scholar.id_no,
            name: scholar.name, // Make 'id_no' the first cell
            ...rest,
          };
        });
      
        // Convert data to CSV format
        const csvData = Papa.unparse(data);
      
        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      
        // Save the CSV data as a file
        saveAs(blob, 'exported_data_All_Scholars.csv');
      };

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
            <div className='place-self-end w-1/6 pt-2'>
              <button
              onClick={exportDataToCSV}
                class=" w-3/6  text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Extract Data
              </button>
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

      const exportDataToCSV = () => {
  
        const data = others.map(scholar => {
          const { id, ...rest } = scholar; // Exclude the 'id' property
          return {
            id_no: scholar.id_no,
            name: scholar.name, // Make 'id_no' the first cell
            ...rest,
          };
        });
      
        // Convert data to CSV format
        const csvData = Papa.unparse(data);
      
        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      
        // Save the CSV data as a file
        saveAs(blob, 'exported_data_All_Scholars.csv');
      };
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
            <div className='place-self-end w-1/6 pt-2'>
              <button
              onClick={exportDataToCSV}
                class=" w-3/6  text-white place-self-end bg-blue-900 hover:bg-blue-950  font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Extract Data
              </button>
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