import React from 'react';
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth,db } from '@/config/firebase';
import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail, signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDocs} from 'firebase/firestore'
import { BsArrowLeftShort,BsSearch, BsCardChecklist, BsFillPersonFill} from "react-icons/bs";
import { RiDashboardFill} from "react-icons/ri";
import { SiGooglescholar} from "react-icons/si";
import { AiOutlineProfile} from "react-icons/ai";
import { BiLogOut} from "react-icons/bi";
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
import SplashScreen from '../components/SplashScreen';
import Swal from 'sweetalert2';

function Home () {
    const [user,loading] = useAuthState(auth);
    const [admin, setAdmin] = useState([]);
    const router = useRouter();
    const [open, setOpen] = useState(true)
    const [accessDenied , setAccessDenied] =useState(false)

    // Check admin user status
    useEffect(() => {
        if (loading) {
        // Auth state is still loading, wait for it to be ready
        return;
        }
        
        if (!user || !user.uid) {
        router.push('/Unauthorized');
        return; // Stop further execution if user or uid is null
    }
    
    const unsubscribe = onSnapshot(
        query(
          collection(db, "admin_users"),
          where("uid", "==", user.uid),
          where('access', '==', true)
        ),
        (querySnapshot) => {
          if (querySnapshot.size === 1) {
            querySnapshot.forEach((doc) => {
              const adminData = doc.data();
              setAdmin(adminData);
            });
          } else {
            setAdmin([]);
            setAccessDenied(true);
          }
        }
      );
    
      return () => unsubscribe(); // Unsubscribe when component unmounts or when dependencies change
    }, [user,loading]);

    function Sign_Out(){
      Swal.fire({
        title: 'Are you sure you want to Logout?',
        showCancelButton: true,
        icon: 'question',
        iconColor: '#000080',
        confirmButtonText: 'Confirm',
        confirmButtonColor: '#000080', 
        cancelButtonText: `Cancel`,
        buttonsStyling: true,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          sessionStorage.setItem('Signout', true);
          sessionStorage.setItem('isFirstRun', 'false');
          sessionStorage.removeItem('Menu');
          router.push('/').then(() => {
            auth.signOut()
              .then(() => {
                console.log('Sign out successful');
              })
              .catch((error) => {
                console.error('Sign out error:', error);
              });
          });
          
        }
      }) 
    }

    useEffect(() => {
      if (accessDenied) {
        let timerInterval
        Swal.fire({
          title: 'Access has been denied!',
          html: 'Automatic logout in <b></b> milliseconds.',
          timer: 5000,
          allowOutsideClick:false,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          setAccessDenied(false);
          sessionStorage.setItem('Signout', true);
          sessionStorage.setItem('isFirstRun', 'false');
          sessionStorage.removeItem('Menu');
          router.push('/').then(() => {
            auth.signOut()
              .then(() => {
                console.log('Sign out successful');
              })
              .catch((error) => {
                console.error('Sign out error:', error);
              });
          });
        })
      return;
      }
    },[accessDenied]);

    const Menus = [
      { title: 'Dashboard' },
      { title: 'Scholars', icon:<SiGooglescholar/> },
      { title: 'Attendance', icon: <BsCardChecklist/> },
      { title: 'Profile', icon: <BsFillPersonFill/> },
    ];

    return(
      <div className="main">
        <div className={`${accessDenied? "absolute inset-0 opacity-90 bg-gray-100 z-50 w-full h-full":""}`}></div>
        <div className='flex'>
          <div className={` bg-blue-950 h-screen ${open ? "w-72":"w-20"} duration-300 p-5 pt-8 relative`}>
            <BsArrowLeftShort className={`bg-white text-blue-950 text-3xl rounded-full absolute -right-3 top-9 border border-blue-950 cursor-pointer ${
              !open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
            />
            <div className='inline-flex'>
              <img src='hcdclogo.png' className={`p-1 bg-red-700 rounded mr-2 cursor-pointer block float-left w-9 h-10 duration-500 ${
                !open && "rotate-[360deg]"}`}/>
              <h1 className={`text-white pt-2 origin-left font-medium font-montserrat duration-300 ${
                !open && "scale-0"
                } `}
              >
                  HCDC-SCHOLAR
                  </h1>
            </div>
            
            <div className={`flex item-center rounded-md bg-light-white mt-6 ${
              !open ? "px-2.5 mt-4":"px-4"
              } py-2`}> 
              <BsSearch className={`text-white text-lg block float-left cursor-pointer ${
                !open && 'mr-1'} `}/>

              <input 
                type={"search"} 
                placeholder='Search' 
                className={`text-base ml-2 bg-transparent w-full text-white focus:outline-none ${
                  !open && "hidden"
                }`}
              />
            </div>
            <div className=''>
              <ul className='pt-2'>
                  {Menus.map((menu, index) => (
                    <>
                      <li key={index} className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2`}>
                        <span className='text-2xl block float-left'> 
                          {menu.icon? menu.icon : <RiDashboardFill/>}
                        </span>
                        <span className={`text-base font-medium flex-1 ${!open && "hidden"} duration-200`}>{menu.title}</span>
                      </li>
                    </>
                  ))}
              </ul>
            </div> 
            <div className={`text-gray-300 text-sm absolute bottom-5 left-5 
            ${
              !open ? "w-11":"w-64"
              } 
              gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md `}
              onClick={Sign_Out}>
              <span className='text-2xl block float-left mr-3'> 
                <BiLogOut/>
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"} duration-200`}>Logout
              </span>
            </div> 
          </div> 

          <div className='p-7'>
            <h1 className='text-2xl font-semibold font-montserrat'>Homepage</h1>
          </div>  
        </div>  
      </div>         
    )
}

export default Home;