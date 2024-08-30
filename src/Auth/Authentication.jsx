import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig";

const signInWithGoogle = async () => {
  
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user)
    return result.user
  } catch (error) {
    console.error(error);
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error(error);
  }
};

export { signInWithGoogle, logOut };