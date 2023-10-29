import React from 'react';
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth,db } from '@/config/firebase';
import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail, signOut } from "firebase/auth";
import { FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import {MdLockOutline} from 'react-icons/md';
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
import SplashScreen from '../components/SplashScreen';

const HomePage = () => {


  const router = useRouter();
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [hcdcEmail, setHcdcEmail] = useState(true);
  const [user] = useAuthState(auth);
  const [sign_up, setSignUp] = useState(false);
  // State variables for error message and animation class
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const [loading, setLoading] = useState(true);


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
  
  function signUp_Attempt(event){
    event.preventDefault();
    try{
      if (signUpPassword==signUpPasswordConfirm){

      }
      else{
        setErrorMessage("Password do not match!");
      setIsShaking(true);

      // Clear the error message and reset the shake animation after a short delay
      setTimeout(() => {
        setErrorMessage('');
        setIsShaking(false);
      }, 2000); // Adjust the duration as needed
      }
    }
    catch{
      setErrorMessage("Password do not match!");
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
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          router.push('/Authentication');
          // ...
        })
        .catch((error) => {
          // Display error message and apply shake animation to the form
        setErrorMessage("Invalid User");
        setIsShaking(true);

        // Clear the error message and reset the shake animation after a short delay
        setTimeout(() => {
          setErrorMessage('');
          setIsShaking(false);
        }, 2000); // Adjust the duration as needed
          
    });
  };


  return (
    <>
    {loading?
      <><SplashScreen/></>:
    <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100'>
      <main className='flex flex-col flex-1 text-center px-20 items-center justify-center w-full h-screen'>
        <div className='bg-white flex rounded-2xl shadow-2xl w-2/3 max-w-4xl'>
          <div className={`w-3/5 p-5 ${isSignUpVisible ? 'signIn-slide-in' : 'signIn-slide-out'}`}>
            <div className={`${isSignUpVisible ? 'text-container-invi' : 'text-container-full'}`}>
              <div className='text-left font-bold font-montserrat'>
                <span className='text-blue-900'>HCDC -</span> SASO
              </div>
              <div className='py-10'>
                <h2 className='text-3xl font-bold text-blue-900 mb-2'>
                  Sign in to your Account
                </h2>
                <div className='border-2 w-10 border-blue-900 inline-block mb-2'></div>
                <div className='flex justify-center my-2 '>
                  <a href='#' className='border-blue-900 text-blue-900 justify-center items-center flex border-2 rounded-full py-2 px-5 hover:bg-blue-950 hover:text-white'>
                    <p className='mr-1 '>Sign in using</p> 
                    <FaGoogle/>
                    <p className=''>oogle</p> 
                  </a>
                </div>
                <p className='text-gray-400 my-3'>or use your HCDC premium email</p>
                <div className='flex flex-col items-center'>
                  <form className={`text-blue-900 ${isShaking ? 'shake text-red-500' : ''}`} method='POST'>
                    <div className='bg-gray-100 w-64 p-2 mb-3 flex items-center'>
                      <FaRegEnvelope className='m-2'/>
                      <input 
                      type='email' 
                      name='signin.email' 
                      required placeholder='HCDC Email' 
                      className='bg-gray-100 outline-none text-sm flex-1'
                      value={signInEmail}
                      onChange={handleSignInEmailChange}/>
                    </div>
                    {isShaking?(<p className='text-red-500 text-sm -mt-3'>*Invalid User Account</p>):null}
                    <div className='bg-gray-100 w-64 mb-3 p-2  flex items-center'>
                      <MdLockOutline className='m-2'/>
                      <input 
                      type='password' 
                      name='signin.password' 
                      required placeholder='Password' 
                      className='bg-gray-100 outline-none text-sm flex-1'
                      value={signInPassword}
                      onChange={handleSignInPasswordChange}/>
                    </div>
                    <button className='border-2 border-blue-900 text-blue-900 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-950 hover:text-white'
                    onClick={Login_Attempt}>
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className={`-mt-[435px]  ${isSignUpVisible ? 'text-container-sign-up' : 'text-container-sign-up-invi'}`} style={{ opacity: isSignUpVisible ? 1 : 0 }}>
                <div className='text-left font-bold font-montserrat '>
                  HCDC - <span className='text-blue-900'>SASO</span>
                </div>
                <div className='mt-8'>
                  <h2 className='text-3xl font-bold text-blue-900 mb-2'>
                    Sign up your Account
                  </h2>
                  <div className='border-2 w-10 border-blue-900 inline-block mb-2'></div>
                  <p className='text-gray-400 my-3'>Using your HCDC premium email</p>
                  <div className='flex flex-col items-center'>
                    <form className={`text-blue-900 ${isShaking ? 'shake text-red-500' : ''}`} method='POST'>
                      <div className='bg-gray-100 w-64 p-2 mb-3  flex items-center'>
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
                        <p className='text-red-600'>*Your HCDC Email is required.</p>
                      ) : null}
                      <div className='bg-gray-100 w-64 mb-3 p-2  flex items-center'>
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
                      {isShaking?(<p className='text-red-500 text-sm -mt-3'>{errorMessage}</p>):null}
                      <div className='bg-gray-100 w-64 mb-3 p-2  flex items-center'>
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
                      <button className='border-2 border-blue-900 text-blue-900 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-950 hover:text-white'
                      onClick={signUp_Attempt}>
                        Sign Up
                      </button>
                    </form>
                  </div>
                </div>
            </div>
          </div>
          <div className={`w-2/5 bg-blue-950 text-gray-100 rounded-tr-2xl rounded-br-2xl py-36 px-12 ${isSignUpVisible ? 'signUp-slide-in' : 'signUp-slide-out'}`}>
            <div className={`${isSignUpVisible ? 'text-container-invi' : 'text-container-full'}`}>
              <h2 className='text-3xl font-bold mb-2 font-montserrat'>Hello, Scholar!</h2>
              <div className='border-2 w-10 border-white inline-block mb-2'></div>
              <p className='mb-10'>
                Fill up personal information and start journey with us.
              </p>
              <button className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-950'
              onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
            <div className={`-mt-48  ${isSignUpVisible ? 'text-container-sign-up' : 'text-container-sign-up-invi'}`} style={{ opacity: isSignUpVisible ? 1 : 0 }}>
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