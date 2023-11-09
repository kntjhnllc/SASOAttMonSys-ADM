import React from 'react';
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth,db } from '@/config/firebase';
import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail, signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDocs} from 'firebase/firestore'
import Swal from 'sweetalert2';
<link rel="icon" type="image/png" href="hcdclogo.png"></link>
import { BsArrowLeftShort,BsSearch, BsCardChecklist, BsFillPersonFill} from "react-icons/bs";
import { RiDashboardFill} from "react-icons/ri";
import { SiGooglescholar} from "react-icons/si";
import { FaUsersCog, FaList} from "react-icons/fa";
import { BiLogOut,BiMenu} from "react-icons/bi";
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
import { Helmet } from "react-helmet";


import SplashScreen from '../components/SplashScreen';


import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import Attendance from '../components/Attendance';
import Scholars from '../components/Scholars';
import Users from '../components/Users';
import Not_Found from '../components/404';


function Home () {
    const [user,loading] = useAuthState(auth);
    const [users,setUsers] = useState([]);
    const [scholars,setScholars] = useState([]);
    const [admin, setAdmin] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [meeting, setMeeting] = useState([]);
    const router = useRouter();
    const [open, setOpen] = useState(true)
    const [accessDenied , setAccessDenied] =useState(false)
    const [Menu, setMenu] = useState('Dashboard');
    const [MenuOptions, setMenuOptions] = useState([]);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    useEffect(() => {
      setOpen(!isMobile);
    }, [isMobile]);

    
    useEffect(() => {
      // Ensure admin.Access is initialized to an empty string when admin is null or undefined
      const adminSuper = admin ? admin.super : undefined;
    
      // Update the adminAuthorityLevel state
      setAdminSuper(adminSuper);
    }, [admin]);
    
    const [adminSuper, setAdminSuper] = useState(false);

    useEffect(() => {
      // Set the title of the web page
      document.title = "HCDC Scholar"; // Replace "Your Page Title" with your desired title
    }, []);
    // Check admin user status
    useEffect(() => {
        if (loading) {
        // Auth state is still loading, wait for it to be ready
        return;
        }
        
        if (!user || !user.uid) {
        setAccessDenied(true);
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

    // admin_users collection

    useEffect(() => {
      const que = query(
        collection(db, "admin_users"), 
        orderBy('name', 'asc'));
        
      const unsubscribe = onSnapshot(que, (querySnapshot) => {

        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const id =change.doc.id;

          console.log('Admin Test read onchange')
          
          if (change.type === "added"){
            setUsers((prevUsers) => [...prevUsers, {...data, id}]);
            console.log("added");
          } else if (change.type === "modified"){
            setUsers((prevUsers) => prevUsers.map((user) => user.id===id? {...data, id} :user));
            console.log("modified");
          }
          else if (change.type === "removed"){
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !==id));
            console.log("removed");
          }
        });
      });
      return () => unsubscribe();
    }, []);
    //users (scholars) collection

    useEffect(() => {
      const que = query(
        collection(db, "users"), 
        orderBy('name', 'asc'));
        
      const unsubscribe = onSnapshot(que, (querySnapshot) => {

        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const id =change.doc.id;

          console.log('users/scholars Test read onchange')
          
          if (change.type === "added"){
            setScholars((prevUsers) => [...prevUsers, {...data, id}]);
            console.log("added");
          } else if (change.type === "modified"){
            setScholars((prevUsers) => prevUsers.map((user) => user.id===id? {...data, id} :user));
            console.log("modified");
          }
          else if (change.type === "removed"){
            setScholars((prevUsers) => prevUsers.filter((user) => user.id !==id));
            console.log("removed");
          }
        });
      });
      return () => unsubscribe();
    }, []);  


    // attendance collection

    useEffect(() => {
      const que = query(
        collection(db, "attendance"), 
        orderBy('dateTime', 'desc'));
        
      const unsubscribe = onSnapshot(que, (querySnapshot) => {

        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const id =change.doc.id;

          console.log('attendance Test read onchange')
          
          if (change.type === "added"){
            setAttendance((prevAttendance) => [...prevAttendance, {...data, id}]);
            console.log("added");
          } else if (change.type === "modified"){
            setAttendance((prevAttendance) => prevAttendance.map((attend) => attend.id===id? {...data, id} :attend));
            console.log("modified");
          }
          else if (change.type === "removed"){
            setAttendance((prevAttendance) => prevAttendance.filter((attend) => attend.id !==id));
            console.log("removed");
          }
        });
      });
      return () => unsubscribe();
    }, []);

    // meeting collection

    useEffect(() => {
      const que = query(
        collection(db, "meeting"), 
        orderBy('meetDate', 'desc'));
        
      const unsubscribe = onSnapshot(que, (querySnapshot) => {

        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const id =change.doc.id;

          console.log('meeting Test read onchange')
          
          if (change.type === "added"){
            setMeeting((prevMeeting) => [...prevMeeting, {...data, id}]);
            console.log("added");
          } else if (change.type === "modified"){
            setMeeting((prevMeeting) => prevMeeting.map((meet) => meet.id===id? {...data, id} :meet));
            console.log("modified");
          }
          else if (change.type === "removed"){
            setMeeting((prevMeeting) => prevMeeting.filter((meet) => meet.id !==id));
            console.log("removed");
          }
        });
      });
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (adminSuper) {
        setMenuOptions([
          { title: 'Dashboard' },
          { title: 'Scholars', icon:<SiGooglescholar/> },
          { title: 'Attendance', icon: <FaList/> },
          { title: 'Profile', icon: <BsFillPersonFill/> },
          { title: 'Users', icon: <FaUsersCog/> },
        ]);
      } else if(adminSuper==undefined) {
        setMenuOptions([
          { title: 'Dashboard' },
          { title: 'Scholars', icon:<SiGooglescholar/> },
          { title: 'Attendance', icon: <FaList/> },
          { title: 'Profile', icon: <BsFillPersonFill/> },
        ]);
      }
    }, [adminSuper,setMenuOptions]);

    

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
          title: 'Access Denied!',
          html: 'Please wait to be given access by ADMIN <br> <p> Automatic logout in <b></b> milliseconds. </p> ', 
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

    useEffect(() => {
      const storedMenu = sessionStorage.getItem('Menu');
      if (storedMenu) {
        setMenu(storedMenu);
      }
    }, [user]);
    

    const [load, setLoading] = useState(true);


    const changeMenu = (selectedOption) => {setMenu(selectedOption);}

    function getMenu() {
      switch (Menu) {
        // eslint-disable-next-line
        case 'Dashboard': return <Dashboard />;break;
        // eslint-disable-next-line
        case 'Scholars': return <Scholars scholars={scholars}/>;break;
        // eslint-disable-next-line
        case 'Attendance': return <Attendance attendance={attendance} meeting={meeting} scholars={scholars}/>;break;
        // eslint-disable-next-line
        case 'Profile': return <Profile/>;break;
        // eslint-disable-next-line
        case 'Users': return <Users users={users}/>;break;
        default: return <Not_Found/>;break;
      }
    }

    useEffect(() => {
      sessionStorage.setItem('Menu', Menu);
      const menu = sessionStorage.getItem('Menu')
      console.log(menu)
    }, [Menu]);
    
    useEffect(() => {
      if(load){
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
    }, []);

    return(
      <div className="main  md:h-screen md:w-full">
        <Helmet>
          <link rel="icon" type="image/png" href="hcdclogo.png" />
        </Helmet>
        {load ? (
          <div className="fixed inset-0 bg-opacity-90 bg-gray-100 backdrop-blur-sm z-50 w-full h-full">
            {/* Content to be displayed when load is true */}
            <SplashScreen />
          </div>
        ) : <div className={`${accessDenied? "absolute inset-0 bg-opacity-90 bg-gray-100  backdrop-blur-sm z-50 w-full h-full":""}`}></div>}
        
        <div className='flex flex-col md:flex-row relative'>
          <div className={`absolute bg-blue-950 md:h-screen ${open ? "md:w-72":"md:w-20"} duration-300 p-5 pt-8 relative`}>
            <BsArrowLeftShort className={`bg-white text-blue-950 text-3xl rounded-full md:absolute hidden lg:flex md:-right-3 md:top-9 border border-blue-950 cursor-pointer ${
              !open && "rotate-180"}`}  
            onClick={() => setOpen(!open)}
            />
            <BiMenu className={` text-white text-5xl absolute flex lg:hidden right-3 top-6 cursor-pointer ${
              !open && "rotate-180"}`}  
            onClick={() => setOpen(!open)}
            />
            
            <div className='md:inline-flex'>
              <img src='hcdclogo.png' className={`p-1 bg-red-700 rounded mr-2 cursor-pointer block float-left w-9 h-10 duration-500 ${
                !open && "rotate-[360deg]"}`}/>
              <h1 className={`text-white md:pt-2 origin-left md:text-lg text-4xl font-medium font-montserrat duration-300 ${
                !open && "md:scale-0"
                } `}
              >
                  HCDC-SCHOLAR
                  </h1>
            </div>
            {/* SEARCH BAR */}
            {/* <div className={`flex item-center  rounded-md bg-light-white mt-6 ${
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
            </div> */}
            <div className={`${open?"":"hidden"}`}>
              <ul className='pt-7'>
                  {MenuOptions.map((menu, index) => (
                    <>
                      <li key={index} onClick={() => changeMenu(menu.title)}
                    type="button"
                    role='button' className={`${Menu === menu.title ? 'font-medium text-white bg-light-white scale-105 opacity-100' : 'font-normal text-white opacity-80'
                  }text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2  `}>
                        <span className='text-2xl block float-left'> 
                          {menu.icon? menu.icon : <RiDashboardFill/>}
                        </span>
                        <span className={`text-base font-medium flex-1 ${!open && "hidden"} duration-200`}>{menu.title}</span>
                      </li>
                    </>
                  ))}
              </ul>
            </div> 
            <div className={`text-gray-300 text-sm md:absolute  
            ${
              !open ? "w-11 hidden":"w-56 md:bottom-5 md:left-5"
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
          <div className={`p-7 w-full max-h-[100vh]`}>
            {getMenu()}
          </div>  
        </div>  
      </div>         
    )
}

export default Home;