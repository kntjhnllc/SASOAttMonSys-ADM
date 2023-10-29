import { auth,db } from '../config/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDocs} from 'firebase/firestore'


function Authentication() {

    const router = useRouter();
    const [user] = useAuthState(auth);
    
    return(
        <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100'>
            <main className='flex flex-col flex-1 text-center px-20 items-center justify-center w-full h-screen'>
            
                <div id="load">
                    <div>G</div>
                    <div>N</div>
                    <div>I</div>
                    <div>D</div>
                    <div>A</div>
                    <div>O</div>
                    <div>L</div>
                </div>
           
            </main>
        </div>
    )
}

export default Authentication;