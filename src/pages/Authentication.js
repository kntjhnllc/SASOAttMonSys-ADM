import { auth,db } from '../config/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from "react";
<link rel="icon" type="image/png" href="hcdclogo.png"></link>
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDocs} from 'firebase/firestore'
import { Helmet } from "react-helmet";

function Authentication() {

    const router = useRouter();
    const [user] = useAuthState(auth);
    useEffect(() => {
      // Set the title of the web page
      document.title = "HCDC Scholar"; // Replace "Your Page Title" with your desired title
    }, []);
    useEffect(() => {
        const checkAdminUserStatus = async () => {
        console.log(user?.uid);
          if (user) {
            const querySnapshot = await getDocs(
              query(collection(db, "admin_users"), where("uid", "==", user.uid), where('access', '==', true))
            );
            console.log("user id: ");
      
            if (querySnapshot.size === 0) {

              router.push('/Main',{isAuthorized:false});
            }else{ router.push('/Main')}
          }
        };
      
        checkAdminUserStatus(); // Initial check
      
        }, [user]);
    
        useEffect(() => {
          const handleBeforeUnload = () => {
            // Clear the isFirstRun flag when the page is reloaded
            sessionStorage.removeItem('isFirstRun');
          };
      
          // Check if it's the first run
          const isFirstRun = sessionStorage.getItem('isFirstRun');
      
          if (isFirstRun === null) {
            // It's the first run, perform any first-run actions
            console.log('First run!');
            // Set a flag to indicate it's not the first run for future visits in this session
            sessionStorage.setItem('isFirstRun', 'false');
          } else {
            // It's not the first run, handle accordingly
            console.log('Not the first run');
          }
      
          window.addEventListener('beforeunload', handleBeforeUnload);
      
          return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
          };
        }, []);

    return(
        <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100'>
          <Helmet>
          <link rel="icon" type="image/png" href="hcdclogo.png" />
        </Helmet>
        <div className="fixed inset-0 bg-opacity-90 bg-gray-100 backdrop-blur-sm z-50 w-full h-full">
            {/* Content to be displayed when load is true */}
            <SplashScreen />
          </div>
        </div>
    )
}

export default Authentication;