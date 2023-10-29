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

function Home () {
    const [user,loading] = useAuthState(auth);
    return(
        <div className='bg-gray-100'>hi {user.email}</div>
               
    )
}

export default Home;