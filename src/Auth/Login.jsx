import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from "./firebaseConfig";
import userStore from '../context/store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser } = userStore();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false); // New state to handle the sign-in process

  const signInWithGoogle = async () => {
    if (isSigningIn) return; // Prevent further clicks if a sign-in is already in progress
    setIsSigningIn(true); // Set the state to true to indicate sign-in is in progress

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsSigningIn(false); // Reset the state once the process is complete
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <h1>AI TRAVEL PLANNER</h1>
      <h1 className="text-3xl font-bold">
        Please Sign In to continue...
      </h1>
      <button
        className="px-5 mt-3 btn btn-accent"
        onClick={signInWithGoogle}
        disabled={isSigningIn} // Disable button while sign-in is in progress
      >
        {isSigningIn ? 'Signing In...' : 'Sign In'}
      </button>
    </div>
  );
}

export default Login;
