import { useEffect, useState, useContext } from "react"
import {useNavigate} from "react-router-dom";
import { getCurrentUser, handleLogin } from "../services/usersService";
import { setAccessToken } from "../auth/tokenStore";
import { AuthContext } from "../auth/AuthProvider";

export function Login(){
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const {setIsLoggedIn, isLoggedIn, isAuthReady} = useContext(AuthContext);

    useEffect(() => {
        if(isAuthReady && isLoggedIn){
            navigate("/", {replace: true});
        }
    },[isAuthReady, isLoggedIn, navigate])

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            const data = await handleLogin(userName, password);
            
            if(data?.access){
                setAccessToken(data.access);
                setIsLoggedIn(true);
                
                const user = await getCurrentUser();
                if(user.is_active){
                    navigate("/", {replace: true});
                }
               
            }
        }catch(err){
            setError(err.message)
        }
    }

    const goToRegister = () => {
        navigate("/register");
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col bg-gray-100 rounded ring-1 ring-blue-100 items-center py-4 px-4 gap-6">
                <h1 className="text-2xl font-semibold">Todo App</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form className="grid gap-4" onSubmit={onSubmit}>
                    <input
                        className="ring-1 ring-gray-200 rounded pl-2"
                        type="text"
                        placeholder="username..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        className="ring-1 ring-gray-200 rounded pl-2"
                        type="password"
                        placeholder="password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded ring-1 ring-blue-400 hover:bg-blue-600">
                        Login
                    </button>
                </form>
                <button
                    onClick={goToRegister}
                    type="submit"
                    className="bg-yellow-500 text-white rounded ring-1 ring-yellow-500 hover:bg-yellow-600 w-full">
                    Register
                </button>
            </div>
        </div>
    )
}

export default Login