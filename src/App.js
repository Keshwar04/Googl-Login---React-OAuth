import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { firebaseConfig } from './firebaseConfig'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import axios from 'axios';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const value = collection(db, 'googleLogin')

const App = () => {

  let user = JSON.parse(localStorage.getItem('userData'))

  const [usersData, setUsersData] = useState(user)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } })
        let userData = { name: res.data.name, mail: res.data.email }
        setUsersData(userData)
        localStorage.setItem('userData', JSON.stringify(userData))
        await addDoc(value, { ...userData, loginTime: new Date().toLocaleString() })
      } catch (e) {
        console.log(e.message);
      }
    },
  });

  const styles = {
    center: {
      display: 'flex',
      justifyContent: 'center'
    }
  }
  return (
    <div>
      {usersData ?
        <>
          <h1 style={{ ...styles.center, margin: 0, color: 'red' }}>Welcome</h1>
          <div style={{...styles.center,color: 'blue'}}>{user.name}(<span style={{color:'#00008d'}}>{user.mail}</span>)</div>
        </>
        :
        <div style={{...styles.center,marginTop:'5px'}}>
          <button onClick={() => login()}>Sign in with google</button>
        </div>
      }
    </div>
  )
}

export default App