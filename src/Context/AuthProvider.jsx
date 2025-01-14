import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../Firebase/FirebaseConfig";


export const AuthContext= createContext()
const auth = getAuth(app)

// eslint-disable-next-line react/prop-types
const AuthProvider = ({children}) => {

    const [user , setUser] = useState()
    const [loading , setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged( auth , currentUser =>{
            setUser(currentUser)
            setLoading(false)
        })
        return ()=>{
            unsubscribe()
        }
    }, [])

      //  registration
      const CreateUser = (email , password) =>{
        setLoading(true)
        return createUserWithEmailAndPassword( auth, email, password)
    }

      // login 
      const login = ( email, password ) =>{
        setLoading(true)    
        return signInWithEmailAndPassword( auth, email, password)
    }

    // logout
    const logout = () =>{
        return signOut(auth)
    }

    const authInfo ={
       user, 
       loading,
       CreateUser,
       login,
       logout
    }

    return (
        <AuthContext.Provider value={authInfo}>
           {children}   
        </AuthContext.Provider>
    );
};

export default AuthProvider;