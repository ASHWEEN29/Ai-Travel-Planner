import React from 'react'
import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig";
import userStore from '../context/store';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const {setUser} = userStore();
  const navigate = useNavigate();
const signInWithGoogle = async () => {
  
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    navigate("/");
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="flex flex-col items-center justify-center ">
    <h1 className="text-3xl font-bold">
      Please Sign In to continue...
    </h1>
    <button
      className="px-5 mt-3 btn btn-accent"
      onClick={signInWithGoogle}
    >
      Sign In
    </button>
  </div>
  )
}

export default Login