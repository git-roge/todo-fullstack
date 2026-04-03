import { useEffect, useState, createContext } from "react";
import { setAccessToken } from "./tokenStore";
import users from "../api/users";
export const AuthContext = createContext();

export function AuthProvider({children}){
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const [loggedOut, setLoggedOut] = useState(false);

    const handleRefresh = async () => {
       
        try{
            const res = await users.post("/token/refresh/", {}, { withCredentials: true})
            setAccessToken(res.data.access)
            setIsLoggedIn(true);
        }catch(err){
            setAccessToken(null);
            setIsLoggedIn(false);
        }finally{
            setIsAuthReady(true);
        }
    }
    useEffect(() => {
        handleRefresh()
    }, []);

    return(
        <AuthContext.Provider value={{isAuthReady, isLoggedIn, setIsLoggedIn}}>
            {isAuthReady ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    )
}