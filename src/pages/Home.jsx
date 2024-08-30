import React, { useEffect } from 'react'

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { logOut } from "../Auth/Authentication";
import { Link,useNavigate } from 'react-router-dom';
import userStore from '../context/store';
const Home = () => {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
       
      } else {
        navigate("/auth")
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();
  const {user}= userStore();
  useEffect(()=>{
    if(!user){
      navigate("/auth")
    }
  },[])
  return (
   <>
   <p>Welcome</p>
    <Link to='/make-trip'>
    Get Started
    </Link>
   <button onClick={logOut}>logout</button>
   </>
  )
}

export default Home