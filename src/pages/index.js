import React from 'react';
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth,db } from '@/config/firebase';
import { useEffect, useState } from "react";
<link rel="icon" type="image/png" href="hcdclogo.png"></link>
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword ,sendPasswordResetEmail, signOut,GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { updateDoc,addDoc, collection, querySnapshot, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDocs} from 'firebase/firestore'
import { FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import {MdLockOutline,MdOutlineDateRange } from 'react-icons/md';
import {PiIdentificationCardLight} from 'react-icons/pi';
import { CiCalendarDate } from "react-icons/ci";
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
import SplashScreen from '../components/SplashScreen';
import Swal from 'sweetalert2';
import { Timestamp } from 'firebase/firestore';
import { Helmet } from "react-helmet";
const HomePage = () => {


  const router = useRouter();
  const isAuthorized = router.query.isAuthorized;
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpIdNo, setSignUpIdNo] = useState('');
  const [signUpBirthdate, setSignUpBirthdate] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [hcdcEmail, setHcdcEmail] = useState(true);
  const [user] = useAuthState(auth);
  const [sign_up, setSignUp] = useState(false);
  const [docID , setDocID] = useState();
  // State variables for error message and animation class
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bdayAgree,setBdayAgree] = useState(false);

  useEffect(() => {
    // Set the title of the web page
    document.title = "HCDC Scholar"; // Replace "Your Page Title" with your desired title
  }, []);

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
      setLoading(true)
      // Set a flag to indicate it's not the first run for future visits in this session
      sessionStorage.setItem('isFirstRun', 'false');
    } else {
      // It's not the first run, handle accordingly
      Swal.fire({
       title: 'Success!',
       text: 'Logged out successfully!',
       icon: 'success',        
       confirmButtonColor:'#000080',
       iconColor:'#000080'
      })
      console.log('Not the first run');
      setLoading(false)
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  useEffect(() => {
    if(loading){
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }
  }, []);

  useEffect(() => { 
    const handleBeforeUnload = () => {
      sessionStorage.setItem('Signout', false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSignUpClick = () => {
    setIsSignUpVisible(!isSignUpVisible);
  };

  
  const handleSignUpEmailChange = (e) => {
    setSignUpEmail(e.target.value);
  };
  const handleSignUpIdNoChange = (e) => {
    setSignUpIdNo(e.target.value);
  };
  const handleSignUpBirthdateChange = (e) =>{
    setSignUpBirthdate(e.target.value);
  };
  const handleSignUpPasswordChange = (e) => {
    setSignUpPassword(e.target.value);
  };
  const handleSignUpPasswordConfirmChange = (e) => {
    setSignUpPasswordConfirm(e.target.value);
  };
  
  const handleSignInEmailChange = (e) => {
    setSignInEmail(e.target.value);
  };

  const handleSignInPasswordChange = (e) => {
    setSignInPassword(e.target.value);
  };

  // const signInWithGoogle = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user; // Get the user object
  //     const uid = user.uid; // Get the user's UID
  //     const email = user.email;
  //     Swal.fire({
  //       position: 'top-end',
  //       title: 'Signin in using Google',
  //       text:"Authenticated as " + email,
  //       showConfirmButton: false,
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading(Swal.getDenyButton());
  //       },
  //     });
      
   
  //     // Now, you can store the UID and email in your collection.
  //     // For example, using Firestore (you need to set up Firestore in your project):
  //     const usersCollection = collection(db, 'admin_users'); // Change 'users' to your collection name
  //     const userData = {
  //       uid: uid,
  //       name: email,
  //       email: email,
  //       access: false,
  //       verified: false,
  //       date_created: serverTimestamp(),
  //     };
    
  //     const q = query(collection(db, 'admin_users'), where('uid', '==', uid));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //     });
  //     setTimeout(() => {
  //     if (!querySnapshot.empty){
  //       router.push('/Authentication');
  //       Swal.close(); // Close Swal
  //     }
  //     else {
  //       addDoc(usersCollection, userData)
  //       .then(() => {
  //         console.log('User data added to the collection');
  //         Swal.close(); // Close Swal
  //       })
  //       .catch((error) => {
  //         console.error('Error adding user data to the collection: ', error);
  //         Swal.close(); // Close Swal
  //       });
  //     }
  //   }, 3000);
      
  //   } catch (error) {
  //     if (error.code === 'auth/cancelled-popup-request') {
  //       Swal.close(); // Close Swal
  //       console.log('User cancelled the sign-in process');
  //     } else {
  //       Swal.close(); // Close Swal
  //       // Handle other sign-in errors here
  //       console.error(error);
  //     }
  //   }
  // };
  


  const signUp_Attempt = async (event)=> {
    event.preventDefault();
    try {
      if (signUpPassword === signUpPasswordConfirm) {
        if (signUpPassword.length <6){
          setErrorMessage('Password should be at least 6 characters!');
          setIsShaking(true);
    
          // Clear the error message and reset the shake animation after a short delay
             setTimeout(() => {
            setErrorMessage('');
            setIsShaking(false);
          }, 2000); // Adjust the duration as needed
        }
        else {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('id_no', '==', signUpIdNo));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setDocID(doc.id);
        });
          if (querySnapshot.empty){
            setErrorMessage('No scholar with the ID No.!');
            setIsShaking(true);
  
            // Clear the error message and reset the shake animation after a short delay
               setTimeout(() => {
              setErrorMessage('');
              setIsShaking(false);
            }, 2000); // Adjust the duration as needed
          }
          else{
          const authInstance = getAuth();
          createUserWithEmailAndPassword(authInstance, signUpEmail, signUpPassword)
            .then((userCredential) => {
              // For access grant
              const user = userCredential.user;
              const userData = {
                id_no: signUpIdNo, // Fix: use user.uid // Fix: use signUpEmail
                email: signUpEmail, // Fix: use signUpEmail
                birthdate: signUpBirthdate,
                access:false,
                verified:false,
                date_created: serverTimestamp(),
              };
              const userDocRef = doc(usersCollection, docID);
              updateDoc(userDocRef, userData);
              sendEmailVerification(user);
              Swal.fire({
                title: 'Sign Up Success!',
                text: 'Verification has been sent to your email!',
                icon: 'success',
                confirmButtonColor: '#000080',
                iconColor: '#000080',
              });
            });
          }
        }
        
      } else {
        setErrorMessage('Password does not match!');
        setIsShaking(true);
  
        // Clear the error message and reset the shake animation after a short delay
           setTimeout(() => {
          setErrorMessage('');
          setIsShaking(false);
        }, 2000); // Adjust the duration as needed
      }
    } catch (error) {
      setErrorMessage('ambot na error');
      setIsShaking(true);
  
      // Clear the error message and reset the shake animation after a short delay
      setTimeout(() => {
        setErrorMessage('');
        setIsShaking(false);
      }, 2000); // Adjust the duration as needed
    }
  }
  

  function Login_Attempt(event){
    
      event.preventDefault();
      // Check credentials
      const auth = getAuth();

      signInWithEmailAndPassword(auth, signInEmail, signInPassword)
        .then((userCredential) => {
          const user = userCredential.user;
      
          // Check if the email is verified
          
            if (user && user.emailVerified) {
              // Email is verified, proceed with signing in
              Swal.fire({
                position: 'top-end',
                timerProgressBar: true,
                title: 'Logging in...',
                color: '#000080',
                showConfirmButton: false,
                timer: 1000
              });
        
              // Redirect the user to the authenticated page
              router.push('/Main');
            } else {
                  Swal.fire({
                    title: 'Email not verified!',
                    text: 'Verification has been sent to your email.',
                    icon: 'warning',
                    confirmButtonColor: '#000080',
                    iconColor: '#000080',
                  });
            }
        })
        .catch((error) => {
          setErrorMessage("Incorrect Credentials!");
          setIsShaking(true);
          console.log(error);
          // Clear the error message and reset the shake animation after a short delay
          setTimeout(() => {
            setErrorMessage('');
            setIsShaking(false);
          }, 2000); // Adjust the duration as needed
        });      
  };

  useEffect(() => {
    const Sign_Out = sessionStorage.getItem('Signout');
    const redirectIfUserIsNotNull = () => {
      // Check if Sign_Out is null or false
      if (Sign_Out === null || Sign_Out === 'false') {
        if (user !== null && sign_up === false) {
          if (loading) {
            setTimeout(() => {
              router.push('/Main');
            }, 2000);
          }
        }
      }
    };
    redirectIfUserIsNotNull(); // Initial check
  }, [user]);


  const handleBirthdateAgreementClick =()=>{
    if (!bdayAgree){
      Swal.fire({
        title: 'Agree to show your birthday?',
        text: 'Entering your birthdate will be agreeing to show your birthday to others.',
        icon: 'warning',
        confirmButtonColor: '#000080',
        iconColor: '#000080',
      }).then((result) => {
        if (result.isConfirmed) {
          setBdayAgree(true)
        } else {
          setBdayAgree(false)
        }
      });
    }
  }

  return (
  
    <>
    {loading?
      <> <div className="fixed inset-0 bg-opacity-90 bg-gray-100 backdrop-blur-sm z-50 w-full h-full">
            {/* Content to be displayed when load is true */}
            <SplashScreen />
          </div>
        <Helmet>
          <link rel="icon" type="image/png" href="hcdclogo.png" />
        </Helmet>
      </>:
    <div className='h-full w-full'>
      <main className='flex flex-col md:flex-1 text-center  px-80 md:px-20 items-center justify-center w-full h-screen'>
        <div className='bg-white flex rounded-2xl mt-96 md:mt-0 shadow-2xl md:w-2/3 md:max-w-4xl'>
          <div className={`w-3/5 p-5 ${isSignUpVisible ? 'signIn-slide-in' : 'signIn-slide-out'}`}>
            <div className={`py-20 md:pb-0 ${isSignUpVisible ? 'text-container-invi' : 'text-container-full'}`}>
              <div className='text-left font-bold font-montserrat  md:pt-0'>
                <span className='text-blue-900'>HCDC -</span> SCHOLAR
              </div>
              <div className='py-10'>
                <h2 className='text-lg md:text-3xl font-bold text-blue-900 md:mb-2'>
                  Sign in to your Account
                </h2>
                <div className='border-2 w-10 border-blue-900 inline-block mb-2'></div>
                <div className='flex flex-col items-center'>
                  <form className={`text-blue-900 ${isShaking ? 'shake text-red-500' : ''}`} onSubmit={Login_Attempt} method='POST'>
                    <div className='bg-gray-100 w-64 md:w-96 p-2 mb-3 flex items-center'>
                      <FaRegEnvelope className='m-2'/>
                      <input 
                      type='email' 
                      name='signin.email' 
                      required placeholder='HCDC Email' 
                      className='bg-gray-100 outline-none text-sm flex-1'
                      value={signInEmail}
                      onChange={handleSignInEmailChange}/>
                    </div>
                    {isShaking?(<p className='text-red-500 text-sm -mt-3'>{errorMessage}</p>):null}
                    <div className='bg-gray-100 w-64 md:w-96 mb-3 p-2  flex items-center'>
                      <MdLockOutline className='m-2'/>
                      <input 
                      type='password' 
                      name='signin.password' 
                      required placeholder='Password' 
                      className='bg-gray-100 outline-none text-sm flex-1'
                      value={signInPassword}
                      onChange={handleSignInPasswordChange}/>
                    </div>
                    <button type='submit' className='border-2 border-blue-900 text-blue-900 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-950 hover:text-white'
                   >
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className={`md:-mt-[410px] -mt-[475px] -ml-5 md:-ml-0 ${isSignUpVisible ? 'text-container-sign-up' : 'text-container-sign-up-invi'}`} style={{ opacity: isSignUpVisible ? 1 : 0 }}>
                <div className='text-left font-bold font-montserrat '>
                  HCDC - <span className='text-blue-900 '>SCHOLAR</span>
                </div>
                <div className='mt-8 pb-10'>
                  <h2 className='text-lg md:text-3xl font-bold text-blue-900 mb-2'>
                    Sign up your Account
                  </h2>
                  <div className='border-2 w-10 border-blue-900 inline-block mb-2'></div>
                 
                  <div className='flex flex-col items-center'>
                    <form className={`text-blue-900 ${isShaking ? 'shake text-red-500' : ''}`} onSubmit={signUp_Attempt} method='POST'>
                      <div className='bg-gray-100 w-64 md:w-96 p-2 mb-3  flex items-center'>
                        <FaRegEnvelope className='m-2'/>
                        <input 
                        type='email' 
                        name='signup.email' 
                        required placeholder='HCDC Email' 
                        className='bg-gray-100 outline-none text-sm flex-1'
                        value={signUpEmail}
                        onChange={handleSignUpEmailChange}
                        />
                      </div>
                      {!hcdcEmail ? (
                        <p className='text-red-600'>{errorMessage}</p>
                      ) : null}
                      <div className='bg-gray-100 w-64 md:w-96 mb-3 p-2  flex items-center'>
                        <PiIdentificationCardLight className='m-2'/>
                        <input 
                        type='' 
                        name='id_no' 
                        required placeholder='ID No.'
                        className='bg-gray-100 outline-none text-sm flex-1'
                        value={signUpIdNo}
                        onChange={handleSignUpIdNoChange}
                        />
                      </div>
                      <div className={`bg-gray-100 w-64 md:w-96 mb-3 p-2 flex items-center ${bdayAgree?"":"cursor-help"}`}
                        onClick={()=>handleBirthdateAgreementClick()}>
                        <MdOutlineDateRange  className='m-2'/>
                        {bdayAgree ? (
                          <input
                            type='date'
                            name='birthdate'
                            className='bg-gray-100 outline-none text-sm flex-1'
                            value={signUpBirthdate}
                            onChange={handleSignUpBirthdateChange}
                          />
                        ) : (
                          <p className='text-gray-400 text-sm '>Birthdate</p>
                        )}
                      </div>
                      <div className='bg-gray-100 w-64 md:w-96 mb-3 p-2  flex items-center'>
                        <MdLockOutline className='m-2'/>
                        <input 
                        type='password' 
                        name='signup.password' 
                        required placeholder='Password' 
                        className='bg-gray-100 outline-none text-sm flex-1'
                        value={signUpPassword}
                        onChange={handleSignUpPasswordChange}
                        />
                      </div>
                      
                      <div className='bg-gray-100 w-64 md:w-96 mb-3 p-2  flex items-center'>
                        <MdLockOutline className='m-2'/>
                        <input 
                        type='password' 
                        name='signup.password' 
                        required placeholder='Confirm Password' 
                        className='bg-gray-100 outline-none text-sm flex-1'
                        value={signUpPasswordConfirm}
                        onChange={handleSignUpPasswordConfirmChange}
                        />
                      </div>
                      {isShaking?(<p className='text-red-500 text-sm -mt-3'>{errorMessage}</p>):null}
                      <button className='border-2 border-blue-900 text-blue-900 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-950 hover:text-white'>
                        Sign Up
                      </button>
                    </form>
                  </div>
                </div>
            </div>
          </div>
          <div className={`w-2/5 bg-blue-950 text-gray-100 rounded-tr-2xl rounded-br-2xl md:py-36 px-12 ${isSignUpVisible ? 'signUp-slide-in' : 'signUp-slide-out'}`}>
            <div className={`${isSignUpVisible ? 'text-container-invi' : 'text-container-full'}`}>
              <h2 className='text-3xl font-bold mb-2 font-montserrat pt-24 md:pt-0'>Hello, Scholar!</h2>
              <div className='border-2 w-10 border-white inline-block mb-2'></div>
              <p className='mb-10'>
                Fill up personal information and start journey with us.
              </p>
              <button className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-950'
              onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
            <div className={`-mt-72 md:-mt-48 ${isSignUpVisible ? 'text-container-sign-up' : 'text-container-sign-up-invi'}`} style={{ opacity: isSignUpVisible ? 1 : 0 }}>
              <h2 className='text-3xl font-bold mb-2 font-montserrat'>Hello, Scholar!</h2>
              <div className='border-2 w-10 border-white inline-block mb-2'></div>
              <p className='mb-10'>
                Already have your account?
              </p>
              <button className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-950'
              onClick={handleSignUpClick}>
                Sign In
              </button>
            </div>
          </div>
        </div>      
      </main>
    </div>
 }</>);
};

export default HomePage;